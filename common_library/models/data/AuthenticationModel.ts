export default class AuthenticationModel {
    public userId: string;
    public access_token: string;

    constructor(userId: string, access_token: string) {
        this.userId = userId;
        this.access_token = access_token;
    }
}
