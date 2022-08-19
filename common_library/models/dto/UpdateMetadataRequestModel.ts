import ResourceTypeModel from '../data/ResourceTypeModel';

export default class UpdateMetadataRequestModel {
    public resourceType?: ResourceTypeModel;
    public name?: string;
    public lastAccessedOn?: Date;
    public lastAccessedBy?: string;

    constructor(resourceType?: ResourceTypeModel, name?: string, lastAccessedOn?: Date, lastAccessedBy?: string){
        this.resourceType = resourceType;
        this.name = name;
        this.lastAccessedOn = lastAccessedOn;
        this.lastAccessedBy = lastAccessedBy;
    }
}
