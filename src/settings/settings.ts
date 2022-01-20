import { IEnvironmentRead } from '@rocket.chat/apps-engine/definition/accessors';
import {
    ISetting,
    SettingType,
} from '@rocket.chat/apps-engine/definition/settings';

export const HUBSPOT_CLIENT_ID = 'hubspot_client_id';
export const HUBSPOT_CLIENT_SECRET = 'hubspot_client_secret';
export const HUBSPOT_REDIRECT_URI = 'hubspot_redirect_uri';

export const SETTINGS: Array<ISetting> = [
    {
        id: HUBSPOT_CLIENT_ID,
        type: SettingType.STRING,
        packageValue: null,
        required: true,
        public: false,
        i18nLabel: HUBSPOT_CLIENT_ID + '_label',
        i18nDescription: HUBSPOT_CLIENT_ID + '_description',
    },
    {
        id: HUBSPOT_CLIENT_SECRET,
        type: SettingType.STRING,
        packageValue: null,
        required: true,
        public: false,
        i18nLabel: HUBSPOT_CLIENT_SECRET + '_label',
        i18nDescription: HUBSPOT_CLIENT_SECRET + '_description',
    },
    {
        id: HUBSPOT_REDIRECT_URI,
        type: SettingType.STRING,
        packageValue: null,
        required: true,
        public: false,
        i18nLabel: HUBSPOT_REDIRECT_URI + '_label',
        i18nDescription: HUBSPOT_REDIRECT_URI + '_description',
    },
];

export async function getSettingValue(environmentRead: IEnvironmentRead, settingId: string): Promise<any> {
    const setting = (await environmentRead
        .getSettings()
        .getById(settingId)) as ISetting;

    return setting.value;
}
