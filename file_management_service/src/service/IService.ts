import AddFileRequestModel from '@dropbox/common_library/models/dto/AddFileRequestModel';
import GetFileRequestModel from '@dropbox/common_library/models/dto/GetFileRequestModel';
import GetFileResponseModel from '@dropbox/common_library/models/dto/GetFileResponseModel';
import ListFileRequestModel from '@dropbox/common_library/models/dto/ListFileRequestModel';
import FileModel from '@dropbox/common_library/models/data/FileModel';
import { UploadedFile } from 'express-fileupload';

export default interface IService {
    addFiles(addFileRequest: AddFileRequestModel[]): Promise<FileModel[]>;
    saveFiles(files: UploadedFile[], userId: string): Promise<void>;
    getFile(getFileRequestModel: GetFileRequestModel): Promise<GetFileResponseModel>;
    listFiles(listFileRequestModel: ListFileRequestModel): Promise<FileModel[]>;
    deleteFile(id: string): Promise<void>;
}
