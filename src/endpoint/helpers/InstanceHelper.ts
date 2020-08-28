import { IModify, IRead } from '@rocket.chat/apps-engine/definition/accessors';

import IRocketInternalDataSource from '../../data/rocket/IRocketInternalDataSource';
import RocketAppsEngine from '../../local/rocket/RocketAppsEngine';

export default class InstanceHelper {

    public static async newDefaultRocketInternalDataSource(read: IRead, modify: IModify): Promise<IRocketInternalDataSource> {
        return new RocketAppsEngine(read, modify);
    }

}
