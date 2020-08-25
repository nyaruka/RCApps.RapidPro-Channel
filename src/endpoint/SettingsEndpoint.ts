import { HttpStatusCode, IHttp, IModify, IPersistence, IRead } from '@rocket.chat/apps-engine/definition/accessors';
import { ApiEndpoint, IApiEndpointInfo, IApiRequest } from '@rocket.chat/apps-engine/definition/api';
import { IApiResponseJSON } from '@rocket.chat/apps-engine/definition/api/IResponse';

import IAppDataSource from '../data/app/IAppDataSource';
import RocketRepositoryImpl from '../data/rocket/RocketRepositoryImpl';
import IBotUser from '../domain/BotUser';
import AppPersistence from '../local/app/AppPersistence';
import RequestBodyValidator from '../utils/RequestBodyValidator';
import RequestHeadersValidator from '../utils/RequestHeadersValidator';
import InstanceHelper from './helpers/InstanceHelper';

export class SettingsEndpoint extends ApiEndpoint {

    public path = 'settings';

    private bodyConstraints = {
        'webhook': {
            presence: {
                allowEmpty: false,
            },
        },
        'webhook.url': {
            presence: {
                allowEmpty: false,
            },
            type: 'string',
            url: true,
        },
        'bot': {
            presence: {
                allowEmpty: false,
            },
        },
        'bot.name': {
            presence: {
                allowEmpty: false,
            },
            type: 'string',
        },
        'bot.username': {
            presence: {
                allowEmpty: false,
            },
            type: 'string',
        },
        'bot.email': {
            presence: {
                allowEmpty: false,
            },
            type: 'string',
            email: true,
        },
        'bot.password': {
            presence: {
                allowEmpty: false,
            },
            type: 'string',
        },

    };

    public async put(
        request: IApiRequest,
        endpoint: IApiEndpointInfo,
        read: IRead,
        modify: IModify,
        http: IHttp,
        persis: IPersistence,
    ): Promise<IApiResponseJSON> {

        // verifica o token de autenticação
        await RequestHeadersValidator.validate(read, request.headers);
        await RequestBodyValidator.validate(this.bodyConstraints, request.content);

        // salva a url de callback do rapidpro na persistencia
        const callbackUrl = request.content.webhook.url;
        const bot = request.content.bot;
        const appDataSource: IAppDataSource = new AppPersistence(read.getPersistenceReader(), persis);

        await appDataSource.setCallbackUrl(callbackUrl);

        // cria um novo bot com as configs recebidas
        const rocketRepo = new RocketRepositoryImpl(
            await InstanceHelper.newDefaultRocketRemoteDataSource(http, read),
        );

        console.log('callbackUrl: ', callbackUrl);
        console.log('bot: ', bot);

        await rocketRepo.createBot(bot as IBotUser);

        return this.json({status: HttpStatusCode.NO_CONTENT});
    }

}
