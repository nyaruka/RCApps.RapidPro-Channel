import {IPersistence, IPersistenceRead} from '@rocket.chat/apps-engine/definition/accessors';
import {RocketChatAssociationModel, RocketChatAssociationRecord} from '@rocket.chat/apps-engine/definition/metadata';

import IAppDataSource from '../../data/app/IAppDataSource';
import PersistenceUtils from '../../utils/PersistenceUtils';

export default class AppPersistence implements IAppDataSource {

    private static readonly ASSOC_CALLBACK_URL = new RocketChatAssociationRecord(
        RocketChatAssociationModel.MISC,
        'AppPersistence_callback_url',
    );

    private persisUtils: PersistenceUtils;

    constructor(reader: IPersistenceRead, writer: IPersistence) {
        this.persisUtils = new PersistenceUtils(reader, writer);
    }

    public async getCallbackUrl(): Promise<string | undefined> {
        return this.persisUtils.readValue(AppPersistence.ASSOC_CALLBACK_URL);
    }

    public async setCallbackUrl(url: string): Promise<void> {
        await this.persisUtils.writeValue(url, AppPersistence.ASSOC_CALLBACK_URL);
    }

}
