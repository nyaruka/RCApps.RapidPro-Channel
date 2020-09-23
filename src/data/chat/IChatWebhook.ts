import {IMessageAttachment} from '@rocket.chat/apps-engine/definition/messages';

export default interface IChatWebhook {

    onDirectMessage(callbackUrl: string, userUsername: string, userName: string, message?: string, attachments?: Array<IMessageAttachment>): Promise<void>;

    onLivechatMessage(callbackUrl: string, visitorToken: string, userUsername: string, userName: string, message?: string): Promise<void>;

}
