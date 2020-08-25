import { HttpStatusCode, IHttp } from '@rocket.chat/apps-engine/definition/accessors';

import IRocketRemoteDataSource from '../../data/rocket/IRocketRemoteDataSource';
import AppError from '../../domain/AppError';
import IBotUser from '../../domain/BotUser';
import IRocketCredentials from '../../domain/RocketCredentials';

export default class RocketRestApi implements IRocketRemoteDataSource {

    constructor(
        private readonly http: IHttp,
        private readonly baseUrl: string,
        private readonly credentials: IRocketCredentials,
        private readonly timeout: number,
    ) {
        this.timeout = this.timeout < 5 ? 5 : this.timeout;
    }

    public async createBot(bot: IBotUser): Promise<string> {

        bot.roles = ['bot'];
        bot.joinDefaultChannels = false;

        const reqOptions = this.requestOptions();
        reqOptions['data'] = bot;

        const response = await this.http.post(`${this.baseUrl}/api/v1/users.create`, reqOptions);

        if (!response || response.statusCode !== HttpStatusCode.OK) {
            throw new AppError(`Could not create bot user, Rocket.Chat returned ${response.statusCode}`,  response.statusCode);
        }

        return response.data.user._id;
    }

    private requestOptions(): object {
        return {
            headers: {
                'Content-Type': 'application/json',
                'X-Auth-Token': this.credentials.authToken,
                'X-User-Id': this.credentials.userId,
            },
        };
    }

}
