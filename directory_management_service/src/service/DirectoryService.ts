import { randomUUID } from "crypto";
import got from "got";
import DirectoryModel from "@dropbox/common_library/models/data/DirectoryModel";
import CreateDirectoryRequestModel from "@dropbox/common_library/models/dto/CreateDirectoryRequestModel";
import IRepository from "../repository/IRepository";
import DirectoryRepository from "../repository/DirectoryRepository";
import IService from "./IService";
import Validation from "@dropbox/common_library/utils/Validation";
import HttpError from "@dropbox/common_library/error/HttpError";
import AddFileRequestModel from "@dropbox/common_library/models/dto/AddFileRequestModel";
import AuthDataModel from "@dropbox/common_library/models/data/AuthDataModel";
import CreateMetadataRequestModel from "@dropbox/common_library/models/dto/CreateMetadataRequestModel";
import { ResourceTypeModel } from "@dropbox/common_library/models/data/ResourceTypeModel";

export default class DirectoryService implements IService{
    private directoryRepository: IRepository;

    constructor() {
        this.directoryRepository = new DirectoryRepository();
    }

    async createDirectory(createDirectoryRequest: CreateDirectoryRequestModel, authData: AuthDataModel): Promise<DirectoryModel> {
        this.validateInputs(createDirectoryRequest);
        let newDirectoryId = randomUUID();
        let newMetadataInput: CreateMetadataRequestModel = new CreateMetadataRequestModel(ResourceTypeModel.FOLDER, createDirectoryRequest.name, 
            newDirectoryId, "fakeHash", new Date(), "directory_management_service");
        let newDirectoryInput: DirectoryModel = {
            _id: newDirectoryId,
            files: [],
            directories: [],
            metadataId: await this.createMetadata(newMetadataInput, authData),
            parentId: createDirectoryRequest.parentId
        }
        return await this.directoryRepository.saveDirectory(newDirectoryInput);
    }

    async getDirectory(id: string): Promise<DirectoryModel> {
        let directory = await this.directoryRepository.getDirectory(id);
        if(directory == null) {
            throw new HttpError(400, "Invalid directoryId input");
        }
        return directory;
    }
    
    async deleteDirectory(id: string): Promise<void> {
        // Check for recursiveness
        await this.directoryRepository.deleteDirectory(id);
    }
    
    async addFilesToDirectory(parentDirectoryId: string, addFileRequest: AddFileRequestModel): Promise<void> {
        let directory = await this.directoryRepository.getDirectory(parentDirectoryId);
        if(directory == null) {
            throw new HttpError(400, "Invalid parentDirectoryId input");
        }
        directory.files.push(addFileRequest.fileId);
        await this.directoryRepository.saveDirectory(directory);
    }

    private validateInputs(data: CreateDirectoryRequestModel) {
        if(!Validation.validateString(data.name)) {
            throw new HttpError(400, "Invalid resource name input");
        }       
        if(!Validation.validateString(data.parentId)) {
            throw new HttpError(400, "Invalid parentId input");
        }
    }

    private async createMetadata(input: CreateMetadataRequestModel, authData: AuthDataModel): Promise<string> {
        let response: {id:string} = await got.post('http://metadata_management_service:3001/metadata/', {
            json: input,
            headers: {'Authorization': authData.bearer_access_token}
        }).json();
        return response.id;
    }

}
