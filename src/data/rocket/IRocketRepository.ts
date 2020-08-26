import IAttachment from '../../domain/Attachment';

export default interface IRocketRepository {

    sendMessage(user: string, bot: string, text?: string, attachments?: Array<IAttachment>): Promise<string>;

}
