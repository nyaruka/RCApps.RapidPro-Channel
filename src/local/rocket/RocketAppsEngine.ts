import { IModify, IRead } from '@rocket.chat/apps-engine/definition/accessors';
import { IVisitor } from '@rocket.chat/apps-engine/definition/livechat';
import { IUser } from '@rocket.chat/apps-engine/definition/users';

import IRocketInternalDataSource from '../../data/rocket/IRocketInternalDataSource';

export default class RocketAppsEngine implements IRocketInternalDataSource {

    constructor(
        private readonly read: IRead,
        private readonly modify: IModify,
    ) { }

    public async getUserByUsername(username: string): Promise<IUser | undefined> {
        return await this.read.getUserReader().getByUsername(username);
    }

    public async getVisitorByToken(token: string): Promise<IVisitor | undefined> {
        return await this.read.getLivechatReader().getLivechatVisitorByToken(token);
    }

    public async sendLivechatMessage(botAgent: IUser, visitor: IVisitor, text?: string, attachments?: Array<string>): Promise<string> {
        throw new Error('Method not implemented.');
    }

    public async sendMessage(bot: IUser, userUsername: string, text?: string, attachments?: Array<string>): Promise<string> {

        const messageBuilder = this.modify.getCreator().startMessage();
        const room = await this.read.getRoomReader().getDirectByUsernames([bot.username, userUsername]);

        messageBuilder.setRoom(room).setSender(bot);
        text && messageBuilder.setText(text);
        // TODO: handle attachments
        // attachments && messageBuilder.setAttachments(attachments)

        return await this.modify.getCreator().finish(messageBuilder);
    }

}
