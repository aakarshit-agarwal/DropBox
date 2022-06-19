export default class AddFileRequestModel {
    public fileName: string;
    public fileHash: string;
    public userId: string;
    public parentId: string;

    constructor(fileName: string, fileHash: string, userId: string, parentId: string) {
        this.fileName = fileName;
        this.fileHash = fileHash;
        this.userId = userId;
        this.parentId = parentId;
    }
}
