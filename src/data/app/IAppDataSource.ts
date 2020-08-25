export default interface IAppDataSource {

    getCallbackUrl(botUsername: string): Promise<string | undefined>;

    setCallbackUrl(url: string, botUsername: string): Promise<void>;

}
