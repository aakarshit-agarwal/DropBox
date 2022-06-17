import AddFileRequestModel from '@dropbox/common_library/models/dto/AddFileRequestModel';
import CreateDirectoryRequestModel from '@dropbox/common_library/models/dto/CreateDirectoryRequestModel';
import DirectoryModel from '@dropbox/common_library/models/data/DirectoryModel';
import AuthDataModel from '@dropbox/common_library/models/data/AuthDataModel';

export default interface IService {
    createDirectory(createMetadataRequest: CreateDirectoryRequestModel, authData: AuthDataModel): Promise<DirectoryModel>;
    getDirectory(id: string): Promise<DirectoryModel>;
    deleteDirectory(id: string): Promise<void>;
    addFilesToDirectory(parentDirectoryId: string, addFileRequest: AddFileRequestModel): Promise<void>;
}
