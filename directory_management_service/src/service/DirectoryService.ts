import { randomUUID } from "crypto";
import DirectoryModel from "@dropbox/common_library/models/data/DirectoryModel";
import CreateDirectoryRequestModel from "@dropbox/common_library/models/dto/CreateDirectoryRequestModel";
import IRepository from "../repository/IRepository";
import DirectoryRepository from "../repository/DirectoryRepository";
import IService from "./IService";
import Validation from "@dropbox/common_library/utils/Validation";
import HttpError from "@dropbox/common_library/error/HttpError";
import AddFileRequestModel from "@dropbox/common_library/models/dto/AddFileRequestModel";
import ListDirectoriesRequestModel from '@dropbox/common_library/models/dto/ListDirectoriesRequestModel';
import EventPublisher from "./../events/EventPublisher";
import DirectoryCreatedEventModel from "@dropbox/common_library/models/events/DirectoryCreatedEventModel";

export default class DirectoryService implements IService{
    private directoryRepository: IRepository;
    private eventPublisher: EventPublisher;

    constructor() {
        this.directoryRepository = new DirectoryRepository();
        this.eventPublisher = new EventPublisher();
    }

    async createDirectory(createDirectoryRequest: CreateDirectoryRequestModel, userId: string): Promise<DirectoryModel> {
        this.validateInputs(createDirectoryRequest);

        let newDirectoryInput: DirectoryModel = {
            _id: randomUUID(),
            files: [],
            directories: [],
            parentId: createDirectoryRequest.parentId,
            userId: userId
        };
        let result = await this.directoryRepository.saveDirectory(newDirectoryInput);

        let directoryCreatedEvent: DirectoryCreatedEventModel = {
            _id: newDirectoryInput._id,
            name: createDirectoryRequest.name,
            parentId: newDirectoryInput.parentId,
            userId: userId,
            resourceHash: "fakeHash",
            uploadedOn: new Date(),
            uploadedBy: userId
        }
        this.eventPublisher.createDirectory(directoryCreatedEvent);
        return result;
    }

    async getDirectory(id: string): Promise<DirectoryModel> {
        let directory = await this.directoryRepository.getDirectory(id);
        if(directory == null) {
            throw new HttpError(400, "Invalid directoryId input");
        }
        return directory;
    }

    async listDirectories(queryParams: ListDirectoriesRequestModel, userId: string): Promise<DirectoryModel[]> {
        return await this.directoryRepository.listDirectory(userId, queryParams.parentId);
    }
    
    async deleteDirectory(id: string): Promise<void> {
        // Check for recursiveness
        await this.directoryRepository.deleteDirectory(id);
        this.eventPublisher.deleteDirectory(id);
    }

    async addFilesToDirectory(parentDirectoryId: string, addFileRequest: AddFileRequestModel): Promise<void> {
        let directory = await this.directoryRepository.getDirectory(parentDirectoryId);
        if(directory == null) {
            throw new HttpError(400, "Invalid parentDirectoryId input");
        }
        directory.files.push(addFileRequest.fileId);
        await this.directoryRepository.saveDirectory(directory);
        this.eventPublisher.updateDirectory(directory);
    }

    private validateInputs(data: CreateDirectoryRequestModel) {
        if(!Validation.validateString(data.name)) {
            throw new HttpError(400, "Invalid resource name input");
        }       
        if(!Validation.validateString(data.parentId)) {
            throw new HttpError(400, "Invalid parentId input");
        }
    }

}
