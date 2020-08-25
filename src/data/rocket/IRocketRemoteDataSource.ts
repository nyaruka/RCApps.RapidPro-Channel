import { IUser } from '@rocket.chat/apps-engine/definition/users';

import IBotUser from '../../domain/BotUser';

export default interface IRocketRemoteDataSource {

    createBot(bot: IBotUser): Promise<string>;

}
