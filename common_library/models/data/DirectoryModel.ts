export default class DirectoryModel {
    public _id: string;
    public files: string[];
    public directories: string[];
    public parentId: string;
    public userId: string;
    public metadataId?: string;

    constructor(_id: string, files: string[], directories: string[], parentId: string, userId: string, metadataId?: string) {
        this._id = _id;
        this.files = files;
        this.directories = directories;
        this.parentId = parentId;
        this.userId = userId;
        this.metadataId = metadataId;
    }
}
