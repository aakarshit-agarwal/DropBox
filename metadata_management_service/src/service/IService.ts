import CreateMetadataRequestModel from './../model/CreateMetadataRequestModel';
import UpdateMetadataRequestModel from './../model/UpdateMetadataRequestModel';
import MetadataModel from '../model/MetadataModel';

export default interface IService {
    createMetadata(createMetadataRequest: CreateMetadataRequestModel): Promise<MetadataModel>;
    getMetadata(id: string): Promise<MetadataModel>;
    updateMetadata(id:string, updateMetadataRequest: UpdateMetadataRequestModel): Promise<MetadataModel>;
    deleteMetadata(id: string): Promise<void>;
}
