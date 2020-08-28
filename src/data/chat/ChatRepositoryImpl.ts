import { HttpStatusCode } from '@rocket.chat/apps-engine/definition/accessors';
import { IMessageAttachment } from '@rocket.chat/apps-engine/definition/messages';

import AppError from '../../domain/AppError';
import IAttachment from '../../domain/Attachment';
import IAppDataSource from '../app/IAppDataSource';
import IChatInternalDataSource from './IChatInternalDataSource';
import IChatRepository from './IChatRepository';
import IChatWebhook from './IChatWebhook';

export default class ChatRepositoryImpl implements IChatRepository {

    constructor(
        private readonly internalDataSource: IChatInternalDataSource,
        private readonly chatWebhook: IChatWebhook,
        private readonly appPersis: IAppDataSource,
    ) { }

    public async sendMessage(userUrn: string, botUsername: string, text?: string, attachments?: Array<IAttachment>): Promise<string> {

        const botUser = await this.internalDataSource.getUserByUsername(botUsername);
        if (!botUser) {
            throw new AppError(`Could not find bot with username ${botUsername}`, HttpStatusCode.NOT_FOUND);
        }
        // userIdentifier will be username if type === `direct` or token if type === `livechat`
        if (userUrn.indexOf(':') !== -1) {
            throw new AppError(`Invalid user identification: ${userUrn}`, HttpStatusCode.BAD_REQUEST);
        }
        const [type, userIdentifier] = [userUrn.substring(0, userUrn.indexOf(':')), userUrn.substring(userUrn.indexOf(':') + 1)];

        if (type === 'direct') {
            if (!await this.internalDataSource.getUserByUsername(userIdentifier)) {
                throw new AppError(`User not found ${userUrn}`, HttpStatusCode.BAD_REQUEST);
            }
            return await this.internalDataSource.sendMessage(botUser, userIdentifier, text, attachments);
        } else if (type === 'livechat') {
            const visitor = await this.internalDataSource.getVisitorByToken(userIdentifier);
            if (!visitor) {
                throw new AppError(`Could not find visitor`, HttpStatusCode.NOT_FOUND);
            }

            return await this.internalDataSource.sendLivechatMessage(botUser, visitor, text);
        } else {
            throw new AppError(`Invalid room type: ${type}`, HttpStatusCode.BAD_REQUEST);
        }
    }

    public async onDirectMessage(userUsername: string, botUsername: string, message?: string, attachments?: Array<IMessageAttachment>): Promise<void> {

        // valida que o bot é um bot válido
        const callbackUrl = await this.appPersis.getCallbackUrl(botUsername);
        if (!callbackUrl) {
            return;
        }
        await this.chatWebhook.onDirectMessage(callbackUrl, userUsername, message, attachments);
    }
    public async onLivechatMessage(visitorToken: string, botUsername: string, message?: string, attachments?: Array<IMessageAttachment>): Promise<void> {
        throw new Error('Method not implemented.');
    }

}
