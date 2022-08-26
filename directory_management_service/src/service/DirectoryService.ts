import { randomUUID } from "crypto";
import DirectoryModel from "@dropbox/common_library/models/data/DirectoryModel";
import CreateDirectoryRequestModel from "@dropbox/common_library/models/dto/CreateDirectoryRequestModel";
import DirectoryRepository from "../repository/DirectoryRepository";
import IService from "./IService";
import Validation from "@dropbox/common_library/utils/Validation";
import HttpError from "@dropbox/common_library/error/HttpError";
import AddFileToDirectoryRequest from "@dropbox/common_library/models/dto/AddFileToDirectoryRequest";
import ListDirectoriesRequestModel from '@dropbox/common_library/models/dto/ListDirectoriesRequestModel';
import EventPublisher from "./../events/EventPublisher";
import DirectoryCreatedEventModel from "@dropbox/common_library/models/events/DirectoryCreatedEventModel";
import Logging from "@dropbox/common_library/logging/Logging";

export default class DirectoryService implements IService {
    private logger: Logging;
    private directoryRepository: DirectoryRepository;
    private eventPublisher: EventPublisher;

    constructor(logger: Logging, directoryRepository: DirectoryRepository, eventPublisher: EventPublisher) {
        this.logger = logger;
        this.directoryRepository = directoryRepository;
        this.eventPublisher = eventPublisher;
    }

    async createDirectory(createDirectoryRequest: CreateDirectoryRequestModel, userId: string): Promise<DirectoryModel> {
        this.logger.logInfo(`Calling createDirectory with createDirectoryRequest: ${createDirectoryRequest}`);
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
        this.logger.logInfo(`Returning createDirectory with result: ${result}`);
        return result;
    }

    async getDirectory(id: string): Promise<DirectoryModel> {
        this.logger.logInfo(`Calling getDirectory with id: ${id}`);
        let directory = await this.directoryRepository.getDirectory(id);
        if(directory == null) {
            throw new HttpError(400, "Invalid directoryId input");
        }
        this.logger.logInfo(`Returning getDirectory with directory: ${directory}`);
        return directory;
    }

    async listDirectories(queryParams: ListDirectoriesRequestModel, userId: string): Promise<DirectoryModel[]> {
        this.logger.logInfo(`Calling listDirectories with queryParams: ${queryParams}`);
        let result = await this.directoryRepository.listDirectory(userId, queryParams.parentId);
        this.logger.logInfo(`Returning listDirectories with result: ${result}`);
        return result;
    }
    
    async deleteDirectory(id: string): Promise<void> {
        this.logger.logInfo(`Calling deleteDirectory with id: ${id}`);
        // Check for recursiveness
        let directory = await this.directoryRepository.getDirectory(id);
        if(directory == null) {
            throw new HttpError(400, "Invalid directoryId input");
        }
        await this.directoryRepository.deleteDirectory(id);
        this.eventPublisher.deleteDirectory(id, directory.userId);
        this.logger.logInfo(`Returning deleteDirectory`);
    }

    async addFilesToDirectory(parentDirectoryId: string, addFileRequest: AddFileToDirectoryRequest): Promise<void> {
        this.logger.logInfo(`Calling addFilesToDirectory with parentDirectoryId: ${parentDirectoryId}, addFileRequest: ${addFileRequest}`);
        let directory = await this.directoryRepository.getDirectory(parentDirectoryId);
        if(directory == null) {
            throw new HttpError(400, "Invalid parentDirectoryId input");
        }
        directory.files.push(addFileRequest.fileId);
        await this.directoryRepository.saveDirectory(directory);
        this.eventPublisher.updateDirectory(directory);
        this.logger.logInfo(`Returning addFilesToDirectory`);
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
