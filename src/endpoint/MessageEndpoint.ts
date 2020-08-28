import { HttpStatusCode, IHttp, IModify, IPersistence, IRead } from '@rocket.chat/apps-engine/definition/accessors';
import { ApiEndpoint, IApiEndpointInfo, IApiRequest } from '@rocket.chat/apps-engine/definition/api';
import { IApiResponseJSON } from '@rocket.chat/apps-engine/definition/api/IResponse';

import ChatRepositoryImpl from '../data/chat/ChatRepositoryImpl';
import RequestBodyValidator from '../utils/RequestBodyValidator';
import RequestHeadersValidator from '../utils/RequestHeadersValidator';
import InstanceHelper from './helpers/InstanceHelper';

export class MessageEndpoint extends ApiEndpoint {

    public path = 'message';

    private bodyConstraints = {
        text: {
            presence: false,
            type: 'string',
        },
        attachments: {
            presence: false,
            type: 'array',
        },
        user: {
            presence: {
                allowEmpty: false,
            },
            type: 'string',
        },
        bot: {
            presence: {
                allowEmpty: false,
            },
            type: 'string',
        },
    };

    public async post(
        request: IApiRequest,
        endpoint: IApiEndpointInfo,
        read: IRead,
        modify: IModify,
        http: IHttp,
        persis: IPersistence,
    ): Promise<IApiResponseJSON> {

        // verifica o token de autenticação
        await RequestHeadersValidator.validate(read, request.headers);
        await RequestBodyValidator.validate(this.bodyConstraints, request.content);

        const chatRepo = new ChatRepositoryImpl(
            await InstanceHelper.newDefaultChatInternalDataSource(read, modify),
            await InstanceHelper.newDefaultChatWebhook(http, read, persis),
            await InstanceHelper.newDefaultAppPersistence(read.getPersistenceReader(), persis),
        );

        const content = request.content;
        const msgId = await chatRepo.sendMessage(content.bot, content.user, content.text, content.attachments);

        return this.json({ status: HttpStatusCode.CREATED, content: { id: msgId } });
    }

}
