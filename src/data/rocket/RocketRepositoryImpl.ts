import { HttpStatusCode } from '@rocket.chat/apps-engine/definition/accessors';

import AppError from '../../domain/AppError';
import IAttachment from '../../domain/Attachment';
import IRocketInternalDataSource from './IRocketInternalDataSource';
import IRocketRepository from './IRocketRepository';

export default class RocketRepositoryImpl implements IRocketRepository {

    constructor(
        private readonly internalDataSource: IRocketInternalDataSource,
    ) { }

    public async sendMessage(botUsername: string, user: string, text?: string, attachments?: Array<IAttachment>): Promise<string> {

        // userUrn will be username if type === `direct` or token if type === `livechat`
        const [type, userUrn] = [user.substring(0, user.indexOf(':')), user.substring(user.indexOf(':') + 1)];
        const botUser = await this.internalDataSource.getUserByUsername(botUsername);
        if (!botUser) {
            throw new AppError(`Could not find bot with username ${botUsername}`, HttpStatusCode.NOT_FOUND);
        }

        if (type === 'direct') {
            return await this.internalDataSource.sendMessage(botUser, userUrn, text, attachments);
        } else if (type === 'livechat') {
            const visitor = await this.internalDataSource.getVisitorByToken(userUrn);
            if (!visitor) {
                throw new AppError(`Could not find visitor`, HttpStatusCode.NOT_FOUND);
            }

            return await this.internalDataSource.sendLivechatMessage(botUser, visitor, text);
        } else {
            throw new AppError(`Invalid room type: ${type}`, HttpStatusCode.BAD_REQUEST);
        }
    }

}
