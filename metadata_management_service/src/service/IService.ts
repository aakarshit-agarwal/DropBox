import CreateMetadataRequestModel from '@dropbox/common_library/models/dto/CreateMetadataRequestModel';
import UpdateMetadataRequestModel from '@dropbox/common_library/models/dto/UpdateMetadataRequestModel';
import MetadataModel from '@dropbox/common_library/models/data/MetadataModel';

export default interface IService {
    createMetadata(createMetadataRequest: CreateMetadataRequestModel): Promise<MetadataModel>;
    getMetadata(id: string): Promise<MetadataModel>;
    updateMetadata(id:string, updateMetadataRequest: UpdateMetadataRequestModel): Promise<MetadataModel>;
    deleteMetadata(id: string): Promise<void>;
}
