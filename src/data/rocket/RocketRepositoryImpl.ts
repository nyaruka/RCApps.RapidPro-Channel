import { IUser } from '@rocket.chat/apps-engine/definition/users';

import IBotUser from '../../domain/BotUser';
import IRocketRemoteDataSource from './IRocketRemoteDataSource';
import IRocketRepository from './IRocketRepository';

export default class RocketRepositoryImpl implements IRocketRepository {

    constructor(
        private readonly remoteDataSource: IRocketRemoteDataSource,
    ) {
    }

    public async createBot(bot: IBotUser): Promise<string> {
        return await this.remoteDataSource.createBot(bot);
    }

}
