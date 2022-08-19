import ResourceTypeModel from '../data/ResourceTypeModel';

export default class CreateMetadataRequestModel {
    public resourceType: ResourceTypeModel;
    public name: string;
    public resourceId: string;
    public resourceHash: string;
    public owner: string;
    public uploadedOn: Date;
    public uploadedBy: string;
    public lastAccessedOn?: Date;
    public lastAccessedBy?: string;

    constructor(resourceType: ResourceTypeModel, name: string, resourceId: string, resourceHash: string, owner: string, 
        uploadedOn: Date, uploadedBy: string, lastAccessedOn?: Date, lastAccessedBy?: string) {
        this.resourceType = resourceType;
        this.name = name;
        this.resourceId = resourceId;
        this.resourceHash = resourceHash;
        this.owner = owner;
        this.uploadedOn = uploadedOn;
        this.uploadedBy = uploadedBy;
        this.lastAccessedOn = lastAccessedOn;
        this.lastAccessedBy = lastAccessedBy;
    }
}
