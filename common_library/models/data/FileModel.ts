export default class FileModel {
    public _id: string;
    public filename: string;
    public fileHash: string;
    public userId: string;
    public parentId: string;

    constructor(_id: string, filename: string, fileHash: string, userId: string, parentId: string) {
        this._id = _id;
        this.filename = filename;
        this.fileHash = fileHash;
        this.userId = userId;
        this.parentId = parentId;
    }
}
