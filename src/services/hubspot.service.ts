import { IEnvironmentRead } from '@rocket.chat/apps-engine/definition/accessors/IEnvironmentRead';

import { HubspotAuthenticationError } from '../errors/hubspot-authentication.error';
import { HubspotRequestError } from '../errors/hubspot-request.error';
import { IHubspotApp } from '../interfaces/hubspot-app';
import { HubspotApplicationRepository } from '../repositories/hubspot-application.repository';
import { HttpService } from '../services/http.service';
import { getSettingValue, HUBSPOT_CLIENT_ID, HUBSPOT_CLIENT_SECRET, HUBSPOT_REDIRECT_URI } from '../settings/settings';

export class HubspotService {
    constructor(
        private hubspotApplicationRepository: HubspotApplicationRepository,
        private environmentRead: IEnvironmentRead,
        private httpService: HttpService,
    ) {}

    public async authenticate(code: string) {
        const oauthSettings = await this.getOauthSettings();

        const response = await this.httpService.postForm('https://api.hubapi.com/oauth/v1/token', {
            grant_type: 'authorization_code',
            client_id: oauthSettings.clientId,
            client_secret: oauthSettings.clientSecret,
            redirect_uri: oauthSettings.redirectUri,
            code,
        });

        if (!this.httpService.isSuccess(response)) {
            throw new HubspotAuthenticationError({
                statusCode: response.statusCode,
                data: response.data,
                content: response.content,
            });
        }

        const expiration = Date.now() + response.data.expires_in;

        await this.hubspotApplicationRepository.create({
            tokenType: response.data.token_type,
            refreshToken: response.data.refresh_token,
            accessToken: response.data.access_token,
            expiresIn: response.data.expires_in,
            expiration,
        });
    }

    public async refreshToken(hubspotApp: any) {
        const oauthSettings = await this.getOauthSettings();

        const response = await this.httpService.postForm('https://api.hubapi.com/oauth/v1/token', {
            grant_type: 'refresh_token',
            client_id: oauthSettings.clientId,
            client_secret: oauthSettings.clientSecret,
            redirect_uri: oauthSettings.redirectUri,
            refresh_token: hubspotApp.refreshToken,
        });

        if (!this.httpService.isSuccess(response)) {
            throw new HubspotAuthenticationError({
                statusCode: response.statusCode,
                data: response.data,
                content: response.content,
            });
        }

        const expiration = new Date();
        expiration.setSeconds(expiration.getSeconds() + response.data.expires_in);

        const newHubspotApp = Object.assign(hubspotApp, {
            refreshToken: response.data.refresh_token,
            accessToken: response.data.access_token,
            expiresIn: response.data.expires_in,
            expiration,
        });

        await this.hubspotApplicationRepository.update(newHubspotApp);

        return newHubspotApp;
    }

    public async findUserByEmail(email: string) {
        const accessToken = await this.getAccessToken();

        const response = await this.httpService.postJson(
            `https://api.hubapi.com/crm/v3/objects/contacts/search`,
            {
                query: email,
            },
            {
                Authorization: `Bearer ${accessToken}`,
            },
        );

        if (!this.httpService.isSuccess(response)) {
            throw new HubspotRequestError();
        }

        return response.data;
    }

    public async getAccessToken() {
        const hubspotApp = (await this.hubspotApplicationRepository.retrieve()) as IHubspotApp;

        if (hubspotApp.expiration <= Date.now()) {
            const newHubspotApp = await this.refreshToken(hubspotApp);

            return newHubspotApp.accessToken;
        }

        return hubspotApp.accessToken;
    }

    private async getOauthSettings() {
        const clientId = await getSettingValue(this.environmentRead, HUBSPOT_CLIENT_ID);
        const clientSecret = await getSettingValue(this.environmentRead, HUBSPOT_CLIENT_SECRET);
        const redirectUri = await getSettingValue(this.environmentRead, HUBSPOT_REDIRECT_URI);

        return {
            clientId,
            clientSecret,
            redirectUri,
        };
    }
}
