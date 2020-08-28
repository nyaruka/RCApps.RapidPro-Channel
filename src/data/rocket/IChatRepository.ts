import IAttachment from '../../domain/Attachment';

export default interface IChatRepository {

    sendMessage(userIdentifier: string, botUsername: string, text?: string, attachments?: Array<IAttachment>): Promise<string>;

}
