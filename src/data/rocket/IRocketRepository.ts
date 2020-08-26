export default interface IRocketRepository {

    sendMessage(user: string, bot: string, text?: string, attachments?: Array<string>): Promise<string>;

}
