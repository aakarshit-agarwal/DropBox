import IRepository from "../repository/IRepository";
import FileRepository from "../repository/FileRepository";
import IService from "./IService";
import AddFileRequestModel from '@dropbox/common_library/models/dto/AddFileRequestModel';
import GetFileRequestModel from '@dropbox/common_library/models/dto/GetFileRequestModel';
import GetFileResponseModel from '@dropbox/common_library/models/dto/GetFileResponseModel';
import ListFileRequestModel from '@dropbox/common_library/models/dto/ListFileRequestModel';
import FileModel from '@dropbox/common_library/models/data/FileModel';
import { randomUUID } from "crypto";
import HttpError from "@dropbox/common_library/error/HttpError";
import EventPublisher from "../events/EventPublisher";
import Logger from '../logger/Logger';
import { UploadedFile } from 'express-fileupload';
import FileSystemManager from "./../utils/FileSystemManager";
import FileAddedEventModel from '@dropbox/common_library/models/events/FileAddedEventModel';
import FileDeletedEventModel from '@dropbox/common_library/models/events/FileDeletedEventModel';

export default class FileService implements IService{
    private fileRepository: IRepository;
    private eventPublished: EventPublisher;
    private fileSystemManager: FileSystemManager;

    constructor() {
        this.fileRepository = new FileRepository();
        this.eventPublished = new EventPublisher();
        this.fileSystemManager = new FileSystemManager();
    }
    
    async addFiles(addFileRequests: AddFileRequestModel[]): Promise<FileModel[]> {
        Logger.logInfo(`Calling addFiles with addFileRequests[]: ${addFileRequests}`);
        let newFileModelInputs: FileModel[] = [];
        addFileRequests.forEach(request => {
            let fileModelInput: FileModel = {
                _id: randomUUID(),
                filename: request.fileName,
                fileHash: request.fileHash,
                userId: request.userId,
                parentId: request.parentId
            };
            newFileModelInputs.push(fileModelInput);
        });
        let result = await this.fileRepository.saveFiles(newFileModelInputs);

        newFileModelInputs.forEach(input => {
            let event: FileAddedEventModel = {
                _id: input._id,
                fileHash: input.fileHash,
                userId: input.userId,
                parentId: input.parentId
            };
            this.eventPublished.addedFile(event);
        });
        Logger.logInfo(`Returning createFile with result: ${result}`);
        return result;
    }
    
    async saveFiles(files: UploadedFile[], userId: string) {
        Logger.logInfo(`Calling saveFiles with files[]: ${files}, userId: ${userId}`);
        files.forEach(file => {
            this.fileSystemManager.saveFile(userId, file);
        });
        Logger.logInfo(`Returning saveFiles`);
    }

    async getFile(getFileRequestModel: GetFileRequestModel): Promise<GetFileResponseModel> {
        Logger.logInfo(`Calling getFile with getFileRequestModel: ${getFileRequestModel}`);
        let file = await this.fileRepository.getFile(getFileRequestModel.fileId);
        if(file == null) {
            throw new HttpError(400, "Invalid fileId input");
        }
        let getFileResponse: GetFileResponseModel = {
            filePath: this.fileSystemManager.getFilePath(file.userId, file.fileHash),
            fileName: file.filename
        };
        Logger.logInfo(`Returning getFile with file: ${getFileResponse}`);
        return getFileResponse;
    }
    
    async deleteFile(id: string): Promise<void> {
        Logger.logInfo(`Calling deleteFile with id: ${id}`);
        let file = await this.fileRepository.getFile(id);
        if(file == null) {
            throw new HttpError(400, "Invalid fileId input");
        }
        await this.fileRepository.deleteFile(id);
        let fileDeletedEvent: FileDeletedEventModel = {
            _id: file._id,
            fileHash: file.fileHash,
            userId: file.userId,
            parentId: file.parentId
        };
        this.eventPublished.deletedFile(fileDeletedEvent);
        Logger.logInfo(`Returning deleteFile`);
    }

    listFiles(listFileRequestModel: ListFileRequestModel): Promise<FileModel[]> {
        Logger.logInfo(`Calling listFile with listFileRequestModel: ${listFileRequestModel}`);
        let files = this.fileRepository.listFiles(listFileRequestModel.userId, 
            listFileRequestModel.parentId, listFileRequestModel.filename);
        Logger.logInfo(`Returning listFile with files: ${files}`);
        return files
    }
}
