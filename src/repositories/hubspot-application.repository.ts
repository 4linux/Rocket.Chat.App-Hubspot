import { IPersistence } from '@rocket.chat/apps-engine/definition/accessors';
import { IPersistenceRead } from '@rocket.chat/apps-engine/definition/accessors/IPersistenceRead';
import { RocketChatAssociationModel, RocketChatAssociationRecord } from '@rocket.chat/apps-engine/definition/metadata';

import { IHubspotApp } from '../interfaces/hubspot-app';

const HUBSPOT_APP_ID = 'hubspot-application';

export class HubspotApplicationRepository {
    constructor(
        private persistence: IPersistence,
        private persistenceReader: IPersistenceRead,
    ) {}

    public async create(hubspotApp: any) {
        return this.persistence.createWithAssociation(
            Object.assign(hubspotApp, {
                createAt: Date.now(),
                updatedAt: Date.now(),
            }),
            new RocketChatAssociationRecord(RocketChatAssociationModel.MISC, HUBSPOT_APP_ID),
        );
    }

    public async retrieve() {
        const results = (await this.persistenceReader.readByAssociation(
            new RocketChatAssociationRecord(RocketChatAssociationModel.MISC, HUBSPOT_APP_ID),
        )) as Array<IHubspotApp>;

        if (!!results.length) {
            return results[0];
        }

        return null;
    }

    public async update(hubspotApp: any) {
        return this.persistence.updateByAssociation(
            new RocketChatAssociationRecord(RocketChatAssociationModel.MISC, HUBSPOT_APP_ID),
            Object.assign(hubspotApp, {
                updatedAt: Date.now(),
            }),
            false,
        );
    }
}
