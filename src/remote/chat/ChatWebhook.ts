import { IHttp, IRead } from '@rocket.chat/apps-engine/definition/accessors';
import { IMessageAttachment } from '@rocket.chat/apps-engine/definition/messages';

import IChatWebhook from '../../data/chat/IChatWebhook';
import { ChatType } from '../../domain/ChatType';
import { RC_SERVER_URL } from '../../settings/Constants';
import AttachmentUtils from '../../utils/AttachmentUtils';

export default class ChatWebhook implements IChatWebhook {

    constructor(
        private readonly read: IRead,
        private readonly http: IHttp,
        private readonly secret: string,
    ) { }

    public async onDirectMessage(
        callbackUrl: string,
        userUsername: string,
        userFullName: string,
        message?: string,
        attachments?: Array<IMessageAttachment>,
    ): Promise<void> {

        const reqOptions = this.requestOptions();
        reqOptions['data'] = await this.createPayload(ChatType.DIRECT, userUsername, userUsername, userFullName, message, attachments);

        await this.http.post(callbackUrl, reqOptions);
    }

    public async onLivechatMessage(
        callbackUrl: string,
        visitorToken: string,
        userUsername: string,
        userFullName: string,
        message?: string,
        attachments?: Array<IMessageAttachment>,
    ): Promise<void> {
        const reqOptions = this.requestOptions();
        reqOptions['data'] = await this.createPayload(ChatType.LIVECHAT, visitorToken, userUsername, userFullName, message, attachments);
        await this.http.post(callbackUrl, reqOptions);
    }

    private async getAttachments(attachments: Array<IMessageAttachment>): Promise<any> {
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

    private async createPayload(
        type: ChatType,
        userUrn: string,
        userUsername: string,
        userFullName: string,
        message?: string,
        attachments?: Array<IMessageAttachment>,
    ) {

        const payload = {
            user: {
                urn: `${type}:${userUrn}`,
                username: userUsername,
                full_name: userFullName,
            },
        };

        message && (payload['text'] = message);
        attachments && (payload['attachments'] = await this.getAttachments(attachments));

        return payload;
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
