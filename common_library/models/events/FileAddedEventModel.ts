export default class FileAddedEventModel {
    public _id: string;
    public name: string;
    public fileHash: string;
    public owner: string;
    public parentId: string;
    public addedOn: Date;
    public addedBy: string;

    constructor(_id: string, name: string, fileHash: string, owner: string, parentId: string, addedOn: Date, addedBy: string) {
        this._id = _id;
        this.name = name;
        this.fileHash = fileHash;
        this.owner = owner;
        this.parentId = parentId;
        this.addedOn = addedOn;
        this.addedBy = addedBy;
    }
}
