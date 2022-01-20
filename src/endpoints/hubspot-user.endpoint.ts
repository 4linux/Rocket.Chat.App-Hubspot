import { HttpStatusCode, IHttp, IModify, IPersistence, IRead } from '@rocket.chat/apps-engine/definition/accessors';
import { ApiEndpoint, IApiEndpointInfo, IApiRequest, IApiResponse } from '@rocket.chat/apps-engine/definition/api';

import { HubspotApplicationRepository } from '../repositories/hubspot-application.repository';
import { HttpService } from '../services/http.service';
import { HubspotService } from '../services/hubspot.service';

export class HubspotUserEndpoint extends ApiEndpoint {
    public path =  'hubspot/user';

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

            const result = await hubspotService.findUserByEmail(request.query.email);

            return this.success(result);
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
