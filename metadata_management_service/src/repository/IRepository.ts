import MetadataModel from '@dropbox/common_library/models/data/MetadataModel';

export default interface IRepository {
    saveMetadata(metadata: MetadataModel): Promise<MetadataModel>;
    getMetadata(id: string): Promise<MetadataModel | null>;
    getMetadataByResourceId(resourceId: string): Promise<MetadataModel | null>;
    deleteMetadata(id: string): Promise<MetadataModel | null>;
}
