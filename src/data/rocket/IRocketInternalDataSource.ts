import { IVisitor } from '@rocket.chat/apps-engine/definition/livechat';
import { IUser } from '@rocket.chat/apps-engine/definition/users';

import IAttachment from '../../domain/Attachment';

export default interface IRocketInternalDataSource {

    sendLivechatMessage(botAgent: IUser, visitor: IVisitor, text?: string): Promise<string>;

    sendMessage(bot: IUser, userUsername: string, text?: string, attachments?: Array<IAttachment>): Promise<string>;

    getUserByUsername(username: string): Promise<IUser | undefined>;

    getVisitorByToken(token: string): Promise<IVisitor | undefined>;

}
