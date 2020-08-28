import { HttpStatusCode } from '@rocket.chat/apps-engine/definition/accessors';

import AppError from '../../domain/AppError';
import IAttachment from '../../domain/Attachment';
import IChatInternalDataSource from './IChatInternalDataSource';
import IChatRepository from './IChatRepository';

export default class ChatRepositoryImpl implements IChatRepository {

    constructor(
        private readonly internalDataSource: IChatInternalDataSource,
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

}
