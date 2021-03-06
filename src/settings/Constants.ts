import { ISetting, SettingType } from '@rocket.chat/apps-engine/definition/settings';

export const RC_SERVER_URL = 'Site_Url';

export const CONFIG_APP_SECRET = 'config_app_secret';
export const CONFIG_REQUEST_TIMEOUT = 'config_request_timeout';

export const APP_SETTINGS: Array<ISetting> = [
    {
        id: CONFIG_APP_SECRET,
        type: SettingType.STRING,
        packageValue: '',
        required: true,
        public: false,
        i18nLabel: CONFIG_APP_SECRET,
    },
    {
        id: CONFIG_REQUEST_TIMEOUT,
        type: SettingType.NUMBER,
        packageValue: 15,
        required: true,
        public: false,
        i18nLabel: CONFIG_REQUEST_TIMEOUT,
    },
];
