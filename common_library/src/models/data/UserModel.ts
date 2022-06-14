export default class UserModel {
    public _id: string;
    public username: string;
    public password: string;
    public name?: string;
    public access_token?: string;

    constructor(_id: string, username: string, password: string, name?: string, access_token?: string) {
        this._id = _id;
        this.username = username;
        this.password = password;
        this.name = name;
        this.access_token = access_token;
    }
}
