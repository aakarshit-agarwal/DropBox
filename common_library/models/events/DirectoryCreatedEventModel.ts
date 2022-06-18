export default class DirectoryCreatedEventModel {
    public _id: string;
    public name: string;
    public parentId: string;
    public userId: string;
    public resourceHash: string;
    public uploadedOn: Date;
    public uploadedBy: string;
    public metadataId?: string;
    public lastAccessedOn?: Date;
    public lastAccessedBy?: string;

    constructor(_id: string, parentId: string, userId: string, metadataId?: string) {
        this._id = _id;
        this.parentId = parentId;
        this.userId = userId;
        this.metadataId = metadataId;
    }
}
