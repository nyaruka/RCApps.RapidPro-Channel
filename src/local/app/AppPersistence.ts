import {IPersistence, IPersistenceRead} from '@rocket.chat/apps-engine/definition/accessors';
import {RocketChatAssociationModel, RocketChatAssociationRecord} from '@rocket.chat/apps-engine/definition/metadata';

import IAppDataSource from '../../data/app/IAppDataSource';
import PersistenceUtils from '../../utils/PersistenceUtils';

export default class AppPersistence implements IAppDataSource {

    private static ASSOC_CALLBACK_URL(botUsername: string): RocketChatAssociationRecord {
        return new RocketChatAssociationRecord(
            RocketChatAssociationModel.MISC,
            'AppPersistence_callback_url_' + botUsername,
        );
    }

    private persisUtils: PersistenceUtils;

    constructor(reader: IPersistenceRead, writer: IPersistence) {
        this.persisUtils = new PersistenceUtils(reader, writer);
    }

    public async getCallbackUrl(botUsername: string): Promise<string | undefined> {
        return this.persisUtils.readValue(AppPersistence.ASSOC_CALLBACK_URL(botUsername));
    }

    public async setCallbackUrl(url: string, botUsername: string): Promise<void> {
        await this.persisUtils.writeValue(url, AppPersistence.ASSOC_CALLBACK_URL(botUsername));
    }

}
