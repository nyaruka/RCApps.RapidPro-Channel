import { IHttp, IRead } from '@rocket.chat/apps-engine/definition/accessors';

import IRocketRemoteDataSource from '../../data/rocket/IRocketRemoteDataSource';
import RocketRestApi from '../../remote/rocket/RocketRestApi';
import {
    CONFIG_RC_X_AUTH_TOKEN,
    CONFIG_RC_X_USER_ID,
    CONFIG_REQUEST_TIMEOUT,
    RC_SERVER_URL,
} from '../../settings/Constants';

export default class InstanceHelper {

    public static async newDefaultRocketRemoteDataSource(
        http: IHttp,
        read: IRead,
        ): Promise<IRocketRemoteDataSource> {

        const baseUrl = await read.getEnvironmentReader().getServerSettings().getValueById(RC_SERVER_URL);
        const timeout = await read.getEnvironmentReader().getSettings().getValueById(CONFIG_REQUEST_TIMEOUT);
        const authToken = await read.getEnvironmentReader().getSettings().getValueById(CONFIG_RC_X_AUTH_TOKEN);
        const userId = await read.getEnvironmentReader().getSettings().getValueById(CONFIG_RC_X_USER_ID);

        return new RocketRestApi(http, baseUrl, {authToken, userId}, timeout);
    }

}
