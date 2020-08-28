import IAttachment from '../../domain/Attachment';

export default interface IChatRepository {

    sendMessage(userUrn: string, botUsername: string, text?: string, attachments?: Array<IAttachment>): Promise<string>;

}
