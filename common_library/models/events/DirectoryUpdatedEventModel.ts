import DirectoryTypeModel from "./../data/DirectoryTypeModel";

export default class DirectoryCreatedEventModel {
    public _id: string;
    public files: string[];
    public directories: string[];
    public parentId: string;
    public owner: string;
    public type: DirectoryTypeModel;
    public metadataId?: string;

    constructor(_id: string, files: string[], directories: string[], parentId: string, owner: string, type: DirectoryTypeModel, metadataId?: string) {
        this._id = _id;
        this.files = files;
        this.directories = directories;
        this.parentId = parentId;
        this.owner = owner;
        this.type = type;
        this.metadataId = metadataId;
    }
}
