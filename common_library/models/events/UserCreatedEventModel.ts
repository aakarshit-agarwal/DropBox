export default class UserCreatedEventModel {
    public _id: string;
    public username: string;
    public name?: string;

    constructor(id: string, username: string, name?: string) {
        this._id = id;
        this.username = username;
        this.name = name;
    }
}
