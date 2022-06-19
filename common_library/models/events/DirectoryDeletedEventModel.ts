export default class DirectoryDeletedEventModel {
    public _id: string;
    public userId: string

    constructor(_id: string, userId: string) {
        this._id = _id;
        this.userId = userId;
    }
}
