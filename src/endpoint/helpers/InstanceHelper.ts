import { IModify, IRead } from '@rocket.chat/apps-engine/definition/accessors';

import IChatInternalDataSource from '../../data/rocket/IChatInternalDataSource';
import ChatAppsEngine from '../../local/rocket/ChatAppsEngine';

export default class InstanceHelper {

    public static async newDefaultRocketInternalDataSource(read: IRead, modify: IModify): Promise<IChatInternalDataSource> {
        return new ChatAppsEngine(read, modify);
    }

}
