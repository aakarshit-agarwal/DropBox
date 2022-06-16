import { ResourceTypeModel } from "./ResourceTypeModel";

export default class MetadataModel {
    public _id: string;
    public resourceType: ResourceTypeModel;
    public name: string;
    public resourceId: string;
    public resourceHash: string;
    public uploadedOn: Date;
    public uploadedBy: string;
    public lastAccessedOn?: Date;
    public lastAccessedBy?: string;

    constructor(_id: string, resourceType: ResourceTypeModel, name: string, resourceId: string, 
        resourceHash: string, uploadedOn: Date, uploadedBy: string, lastAccessedOn?: Date, lastAccessedBy?: string) {
        this._id = _id;
        this.resourceType = resourceType;
        this.name = name;
        this.resourceId = resourceId;
        this.resourceHash = resourceHash;
        this.uploadedOn = uploadedOn;
        this.uploadedBy = uploadedBy;
        this.lastAccessedOn = lastAccessedOn;
        this.lastAccessedBy = lastAccessedBy;
    }
}
