import { ResourceTypeModel } from './ResourceTypeModel';

export default interface UpdateMetadataRequestModel {
    resourceType?: ResourceTypeModel,
    name?: string,
    lastAccessedOn?: Date,
    lastAccessedBy?: string
}
