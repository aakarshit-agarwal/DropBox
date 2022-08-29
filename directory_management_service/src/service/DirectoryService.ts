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
import Logging from "@dropbox/common_library/logging/Logging";
import AuthDataModel from "@dropbox/common_library/models/data/AuthDataModel";
import DirectoryTypeModel from "@dropbox/common_library/models/data/DirectoryTypeModel";

export default class DirectoryService implements IService {
    private logger: Logging;
    private directoryRepository: DirectoryRepository;
    private eventPublisher: EventPublisher;

    constructor(logger: Logging, directoryRepository: DirectoryRepository, eventPublisher: EventPublisher) {
        this.logger = logger;
        this.directoryRepository = directoryRepository;
        this.eventPublisher = eventPublisher;
    }

    async createDirectory(createDirectoryRequest: CreateDirectoryRequestModel, authData: AuthDataModel) {
        this.logger.logDebug(`Calling createDirectory with createDirectoryRequest: ${createDirectoryRequest}`);

        // Validations
        if(!Validation.validateDirectoryName(createDirectoryRequest.name)) {
            throw new HttpError(400, "Invalid directory name");
        }
        if(createDirectoryRequest.type !== DirectoryTypeModel.ROOT && authData.access_token !== process.env.DIRECTORY_MANAGEMENT_SERVICE_NAME) {
            let parentDirectory = await this.getDirectory(createDirectoryRequest.parentId, authData);
            if(!parentDirectory || parentDirectory.owner !== authData.jwtPayload.id) {
                throw new HttpError(404, "Invalid parentId");
            }    
        }

        // Logic
        let directoryModel: DirectoryModel = {
            _id: randomUUID(),
            files: [],
            directories: [],
            parentId: createDirectoryRequest.parentId,
            owner: authData.jwtPayload.id,
            type: createDirectoryRequest.type
        };
        let result = await this.directoryRepository.saveDirectory(directoryModel);
        this.logger.logInfo(`Directory created with Id: ${result._id}`);

        // Publish Event
        this.eventPublisher.createDirectory(result, createDirectoryRequest.name);

        this.logger.logDebug(`Returning createDirectory with result: ${result}`);
        return result;
    }

    async getDirectory(id: string, authData: AuthDataModel) {
        this.logger.logDebug(`Calling getDirectory with id: ${id}`);

        // Logic
        let directory = await this.directoryRepository.getDirectory(id);
        if(!directory) {
            throw new HttpError(404, "Invalid directoryId");
        }

        // Access Check
        if(directory.owner !== authData.jwtPayload.id) {
            throw new HttpError(403, "Not authorized");
        }
 
        this.logger.logDebug(`Returning getDirectory with directory: ${directory}`);
        return directory;
    }

    async listDirectories(queryParams: ListDirectoriesRequestModel, authData: AuthDataModel) {
        this.logger.logDebug(`Calling listDirectories with queryParams: ${queryParams}`);

        // Logic
        let result = await this.directoryRepository.listDirectory(authData.jwtPayload.id, queryParams);

        this.logger.logDebug(`Returning listDirectories with result: ${result}`);
        return result;
    }
    
    async deleteDirectory(directoryId: string, authData: AuthDataModel) {
        this.logger.logDebug(`Calling deleteDirectory with directoryId: ${directoryId}`);

        // Validations && Access Check
        let directory = await this.directoryRepository.getDirectory(directoryId);
        if(!directory || directory.owner !== authData.jwtPayload.id) {
            throw new HttpError(400, "Invalid directoryId");
        }
        if(directory.type === DirectoryTypeModel.ROOT && authData.access_token !== process.env.DIRECTORY_MANAGEMENT_SERVICE_NAME) {
            throw new HttpError(404, "Not  authorized to delete root diectory");

        }

        // Logic
        await this.directoryRepository.deleteDirectory(directoryId);
        this.logger.logInfo(`Deleting directory with Id: ${directoryId}`);

        // Publishing Event
        this.eventPublisher.deleteDirectory(directory);

        let result = {
            status: true
        };
        this.logger.logDebug(`Returning deleteDirectory with result: ${result}`);
        return result;
    }

    async addFilesToDirectory(parentDirectoryId: string, addFileRequests: AddFileToDirectoryRequest[], authData: AuthDataModel) {
        this.logger.logDebug(`Calling addFilesToDirectory with parentDirectoryId: ${parentDirectoryId}, addFileRequests: ${addFileRequests}`);

        // Validations & Access Check
        let fileIdsToAdd: string[] = [];
        addFileRequests.forEach(file => {
            if(!Validation.validateFileId(file.fileId)) {
                fileIdsToAdd.push(file.fileId);
            }
        });
        let directory = await this.getDirectory(parentDirectoryId, authData);
        if(!directory || directory.owner !== authData.jwtPayload.id) {
            throw new HttpError(404, "Invalid parentId");
        }

        // Logic
        directory.files = directory.files.concat(fileIdsToAdd);
        let updatedDirectory = await this.directoryRepository.saveDirectory(directory);
        this.logger.logInfo(`Adding files to directory with Id: ${updatedDirectory._id}`);

        // Publishing Event
        this.eventPublisher.updateDirectory(updatedDirectory);

        let result = {
            directory: {
                id: updatedDirectory._id,
                files: updatedDirectory.files
            }
        };
        this.logger.logDebug(`Returning addFilesToDirectory with result: ${result}`);
        return result;
    }

}
