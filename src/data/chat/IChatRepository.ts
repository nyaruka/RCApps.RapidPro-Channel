import { IMessageAttachment } from '@rocket.chat/apps-engine/definition/messages';

import IAttachment from '../../domain/Attachment';

export default interface IChatRepository {

    sendMessage(userUrn: string, botUsername: string, text?: string, attachments?: Array<IAttachment>): Promise<string>;

    onDirectMessage(userUsername: string, botUsername: string, message?: string, attachments?: Array<IMessageAttachment>): Promise<void>;

    onLivechatMessage(visitorToken: string, botUsername: string, message?: string, attachments?: Array<IMessageAttachment>): Promise<void>;

}
