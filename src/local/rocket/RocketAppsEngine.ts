import { HttpStatusCode, IModify, IRead } from '@rocket.chat/apps-engine/definition/accessors';
import { IVisitor } from '@rocket.chat/apps-engine/definition/livechat';
import { IRoom, RoomType } from '@rocket.chat/apps-engine/definition/rooms';
import { IUser } from '@rocket.chat/apps-engine/definition/users';

import IRocketInternalDataSource from '../../data/rocket/IRocketInternalDataSource';
import AppError from '../../domain/AppError';

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

        const rooms = await this.read.getLivechatReader().getLivechatRooms(visitor);
        if (!rooms) {
            throw new AppError(`Could not find livechat room for visitor: ${visitor.token}`, HttpStatusCode.NOT_FOUND);
        }

        // TODO: check if index 0 will work on all situations
        const livechatMessageBuilder = this.modify.getCreator().startLivechatMessage()
            .setRoom(rooms[0])
            .setSender(botAgent);

        text && livechatMessageBuilder.setText(text);
        // TODO: handle attachments
        // attachments && livechatMessageBuilder.setAttachments(attachments);

        return await this.modify.getCreator().finish(livechatMessageBuilder);
    }

    public async sendMessage(bot: IUser, userUsername: string, text?: string, attachments?: Array<string>): Promise<string> {

        let room: IRoom | undefined = await this.read.getRoomReader().getDirectByUsernames([bot.username, userUsername]);

        // if user have never spoken with the bot, the room is undefined, we need to create a new direct room
        if (!room) {
            const roomBuilder = await this.modify.getCreator().startRoom()
                .setCreator(bot)
                .setType(RoomType.DIRECT_MESSAGE)
                .setDisplayName('')
                .setMembersToBeAddedByUsernames([userUsername]);

            const roomId = await this.modify.getCreator().finish(roomBuilder);
            room = await this.read.getRoomReader().getById(roomId);
        }

        const messageBuilder = this.modify.getCreator().startMessage()
            .setRoom(room!)
            .setSender(bot);
        text && messageBuilder.setText(text);
        // TODO: handle attachments
        // attachments && messageBuilder.setAttachments(attachments)

        return await this.modify.getCreator().finish(messageBuilder);
    }

}
