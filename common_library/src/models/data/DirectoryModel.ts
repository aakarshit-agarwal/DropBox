export default class DirectoryModel {
    public _id: string;
    public files: string[];
    public directories: string[];
    public metadataId: string;
    public parentId: string;

    constructor(_id: string, files: string[], directories: string[], metadataId: string, parentId: string) {
        this._id = _id;
        this.files = files;
        this.directories = directories;
        this.metadataId = metadataId;
        this.parentId = parentId;
    }
}
