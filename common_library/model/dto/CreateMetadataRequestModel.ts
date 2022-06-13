import { ResourceTypeModel } from './ResourceTypeModel';

export default interface CreateMetadataRequestModel {
    resourceType: ResourceTypeModel,
    name: string,
    resourceId: string,
    resourceHash: string,
    uploadedOn: Date,
    uploadedBy: string,
    lastAccessedOn?: Date,
    lastAccessedBy?: string
}
