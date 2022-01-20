import {
    IAppAccessors,
    IConfigurationExtend,
    IEnvironmentRead,
    ILogger,
} from '@rocket.chat/apps-engine/definition/accessors';
import { ApiSecurity, ApiVisibility } from '@rocket.chat/apps-engine/definition/api';
import { App } from '@rocket.chat/apps-engine/definition/App';
import { IAppInfo } from '@rocket.chat/apps-engine/definition/metadata';

import { HubspotOauthEndpoint } from './src/endpoints/hubspot-oauth.endpoint';
import { HubspotUserEndpoint } from './src/endpoints/hubspot-user.endpoint';
import { SETTINGS } from './src/settings/settings';

export class IntegracaoHubspotApp extends App {
    constructor(info: IAppInfo, logger: ILogger, accessors: IAppAccessors) {
        super(info, logger, accessors);
    }

    protected async extendConfiguration(
        configuration: IConfigurationExtend,
        environmentRead: IEnvironmentRead,
    ): Promise<void> {
        await SETTINGS.forEach((setting) => configuration.settings.provideSetting(setting));

        await configuration.api.provideApi({
            visibility: ApiVisibility.PUBLIC,
            security: ApiSecurity.UNSECURE,
            endpoints: [
                new HubspotOauthEndpoint(this),
                new HubspotUserEndpoint(this),
            ],
        });
    }
}
