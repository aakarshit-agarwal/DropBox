import { ResourceTypeModel } from './ResourceTypeModel';

export default interface MetadataModel {
    resourceType: ResourceTypeModel,
    name: string,
    resourceId: string,
    resourceHash: string,
    uploadedOn: Date,
    uploadedBy: string,
    lastAccessedOn?: Date,
    lastAccessedBy?: string
}
