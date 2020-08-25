export default interface IBotUser {

    readonly name: string;
    readonly username: string;
    readonly email: string;
    readonly password: string;
    roles: Array<string>;
    joinDefaultChannels: boolean;

}
