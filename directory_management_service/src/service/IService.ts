import AddFileRequestModel from '../model/AddFileRequestModel';
import CreateDirectoryRequestModel from '../model/CreateDirectoryRequestModel';
import DirectoryModel from '../model/DirectoryModel';

export default interface IService {
    createDirectory(createMetadataRequest: CreateDirectoryRequestModel, authData: any): Promise<DirectoryModel>;
    getDirectory(id: string): Promise<DirectoryModel>;
    deleteDirectory(id: string): Promise<void>;
    addFilesToDirectory(parentDirectoryId: string, addFileRequest: AddFileRequestModel): Promise<void>;
}
