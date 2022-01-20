import { HttpStatusCode, IHttp, IModify, IPersistence, IRead } from '@rocket.chat/apps-engine/definition/accessors';
import { ApiEndpoint, IApiEndpointInfo, IApiRequest, IApiResponse } from '@rocket.chat/apps-engine/definition/api';

import { HubspotAuthenticationError } from '../errors/hubspot-authentication.error';
import { HubspotApplicationRepository } from '../repositories/hubspot-application.repository';
import { HttpService } from '../services/http.service';
import { HubspotService } from '../services/hubspot.service';

export class HubspotOauthEndpoint extends ApiEndpoint {
    public path =  'hubspot/oauth';

    public async get(
        request: IApiRequest,
        endpoint: IApiEndpointInfo,
        read: IRead,
        modify: IModify,
        http: IHttp,
        persis: IPersistence,
    ): Promise<IApiResponse> {
        try {
            const hubspotService = new HubspotService(
                new HubspotApplicationRepository(persis, read.getPersistenceReader()),
                read.getEnvironmentReader(),
                new HttpService(http),
            );

            await hubspotService.authenticate(request.query.code);

            return this.success({
                message: 'Autenticado com sucesso!',
            });
        } catch (err) {
            if (err instanceof HubspotAuthenticationError) {
                return this.json({
                    status: HttpStatusCode.BAD_REQUEST,
                    content: {
                        message: err.message,
                        response: err.getResponseData(),
                    },
                });
            }

            return this.json({
                status: HttpStatusCode.INTERNAL_SERVER_ERROR,
                content: {
                    message: 'Um erro desconhecido ocorreu',
                },
            });
        }
    }

    public async put(
        request: IApiRequest,
        endpoint: IApiEndpointInfo,
        read: IRead,
        modify: IModify,
        http: IHttp,
        persis: IPersistence,
    ): Promise<IApiResponse> {
        try {
            const hubspotService = new HubspotService(
                new HubspotApplicationRepository(persis, read.getPersistenceReader()),
                read.getEnvironmentReader(),
                new HttpService(http),
            );

            await hubspotService.getAccessToken();

            return this.success({
                message: 'Atualizado com sucesso!',
            });
        } catch (err) {
            return this.json({
                status: HttpStatusCode.INTERNAL_SERVER_ERROR,
                content: {
                    message: 'Um erro desconhecido ocorreu',
                },
            });
        }
    }
}
