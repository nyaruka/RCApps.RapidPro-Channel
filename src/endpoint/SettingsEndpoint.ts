import { HttpStatusCode, IHttp, IModify, IPersistence, IRead } from '@rocket.chat/apps-engine/definition/accessors';
import { ApiEndpoint, IApiEndpointInfo, IApiRequest } from '@rocket.chat/apps-engine/definition/api';
import { IApiResponseJSON } from '@rocket.chat/apps-engine/definition/api/IResponse';

import IAppDataSource from '../data/app/IAppDataSource';
import AppPersistence from '../local/app/AppPersistence';
import RequestBodyValidator from '../utils/RequestBodyValidator';
import RequestHeadersValidator from '../utils/RequestHeadersValidator';

export class SettingsEndpoint extends ApiEndpoint {

    public path = 'settings';

    private bodyConstraints = {
        'webhook': {
            presence: {
                allowEmpty: false,
            },
        },
        'webhook.url': {
            presence: {
                allowEmpty: false,
            },
            type: 'string',
            url: true,
        },
        'bot': {
            presence: {
                allowEmpty: false,
            },
        },
        'bot.username': {
            presence: {
                allowEmpty: false,
            },
            type: 'string',
        },

    };

    public async put(
        request: IApiRequest,
        endpoint: IApiEndpointInfo,
        read: IRead,
        modify: IModify,
        http: IHttp,
        persis: IPersistence,
    ): Promise<IApiResponseJSON> {

        await RequestHeadersValidator.validate(read, request.headers);
        await RequestBodyValidator.validate(this.bodyConstraints, request.content);

        const botUsername =  request.content.bot.username;
        const botUser = await read.getUserReader().getByUsername(botUsername);

        if (!botUser || !botUser.isEnabled || !botUser.roles.includes('livechat-agent') || !botUser.roles.includes('bot')) {
            return this.json({ status: HttpStatusCode.CONFLICT , content: {error: 'Bot is misconfigured or non existent'}});
        }

        const appDataSource: IAppDataSource = new AppPersistence(read.getPersistenceReader(), persis);
        await appDataSource.setCallbackUrl(request.content.webhook.url, request.content.bot.username);

        return this.json({ status: HttpStatusCode.NO_CONTENT });
    }

}
