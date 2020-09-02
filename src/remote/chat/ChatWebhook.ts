import { IHttp, IPersistence, IRead } from '@rocket.chat/apps-engine/definition/accessors';
import { IMessageAttachment } from '@rocket.chat/apps-engine/definition/messages';

import IChatWebhook from '../../data/chat/IChatWebhook';
import { RC_SERVER_URL } from '../../settings/Constants';
import AttachmentUtils from '../../utils/AttachmentUtils';

export default class ChatWebhook implements IChatWebhook {

    constructor(
        private readonly read: IRead,
        private readonly http: IHttp,
        private readonly persistence: IPersistence,
        private readonly secret: string,
    ) { }

    public async onDirectMessage(callbackUrl: string, userUsername: string, message?: string, attachments?: Array<IMessageAttachment>): Promise<void> {
        const payload = {
            user: `direct:${userUsername}`,
        };

        message && (payload['text'] = message);
        attachments && (payload['attachments'] = await this.getAttachments(attachments));

        const reqOptions = this.requestOptions();
        reqOptions['data'] = payload;

        await this.http.post(callbackUrl, reqOptions);
    }

    public async onLivechatMessage(callbackUrl: string, visitorToken: string, message?: string): Promise<void> {
        const payload = {
            user: `livechat:${visitorToken}`,
        };

        message && (payload['text'] = message);

        const reqOptions = this.requestOptions();
        reqOptions['data'] = payload;

        await this.http.post(callbackUrl, reqOptions);
    }

    private async getAttachments(attachments: Array< IMessageAttachment>): Promise<any> {
        const attachmentsPayload: { [key: string]: any } = [];
        const serverUrl = await this.read.getEnvironmentReader().getServerSettings().getValueById(RC_SERVER_URL);

        attachments.forEach((attachment) => {
            const url = AttachmentUtils.getUrl(serverUrl, attachment);
            let type = AttachmentUtils.getType(attachment);

            if (type === 'document') {
                if (url.endsWith('.pdf')) {
                    type += '/pdf';
                    attachmentsPayload.push({ type, url });
                }
            } else {
                attachmentsPayload.push({ type, url });
            }
        });

        return attachmentsPayload;
    }

    private requestOptions(): object {
        return {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Token ${this.secret}`,
            },
        };
    }
}
