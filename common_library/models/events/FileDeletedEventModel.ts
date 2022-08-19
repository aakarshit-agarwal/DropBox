export default class FileDeletedEventModel {
    public _id: string;
    public fileHash: string;
    public userId: string;
    public parentId: string;

    constructor(_id: string, fileHash: string, userId: string, parentId: string) {
        this._id = _id;
        this.fileHash = fileHash;
        this.userId = userId;
        this.parentId = parentId;
    }
}
