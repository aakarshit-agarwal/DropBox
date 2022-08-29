import DirectoryTypeModel from "./../data/DirectoryTypeModel";

export default class DirectoryCreatedEventModel {
    public _id: string;
    public name: string;
    public parentId: string;
    public owner: string;
    public uploadedOn: Date;
    public uploadedBy: string;
    public type: DirectoryTypeModel;
    public metadataId?: string;
    public lastAccessedOn?: Date;
    public lastAccessedBy?: string;

    constructor(_id: string, parentId: string, owner: string, type: DirectoryTypeModel, metadataId?: string) {
        this._id = _id;
        this.parentId = parentId;
        this.owner = owner;
        this.type = type;
        this.metadataId = metadataId;
    }
}
