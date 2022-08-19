import AddFileToDirectoryRequest from '@dropbox/common_library/models/dto/AddFileToDirectoryRequest';
import CreateDirectoryRequestModel from '@dropbox/common_library/models/dto/CreateDirectoryRequestModel';
import DirectoryModel from '@dropbox/common_library/models/data/DirectoryModel';

export default interface IService {
    createDirectory(createMetadataRequest: CreateDirectoryRequestModel, userId: string): Promise<DirectoryModel>;
    getDirectory(id: string): Promise<DirectoryModel>;
    listDirectories(queryParams: any, userId: string): Promise<DirectoryModel[]>;
    deleteDirectory(id: string): Promise<void>;
    addFilesToDirectory(parentDirectoryId: string, addFileRequest: AddFileToDirectoryRequest): Promise<void>;
}
