import { Model } from "mongoose";
import FileModel from '@dropbox/common_library/models/data/FileModel';
import MongoFileModel from '@dropbox/common_library/models/mongo/MongoFileModel';
import IRepository from "./IRepository";
import Logging from "@dropbox/common_library/logging/Logging";

export default class FileRepository implements IRepository {
    private applicationContext: any;
    private logger: Logging;
    private fileModel: Model<FileModel>;

    constructor(applicationContext: any) {
        this.applicationContext = applicationContext;
        this.logger = this.applicationContext.logger;
        this.fileModel = MongoFileModel.fileModel;
    }

    async saveFiles(files: FileModel[]): Promise<FileModel[]> {
        this.logger.logInfo(`Calling saveFile with file: ${JSON.stringify(files)}`);
        let resultPromise: Promise<FileModel>[] = [];
        files.forEach(async file => {
            let newFile = new this.fileModel(file);
            resultPromise.push(newFile.save());
        });
        let result = Promise.all(resultPromise);
        this.logger.logInfo(`Returning saveFile with result: ${result}`);
        return result;
    }

    async getFile(id: string): Promise<FileModel | null> {
        this.logger.logInfo(`Calling getFile with id: ${id}`);
        let result = await this.fileModel.findById(id);
        this.logger.logInfo(`Returning getFile with result: ${result}`);
        return result;
    }

    async listFiles(userId: string, parentId?: string, filename?: 
        string): Promise<FileModel[]> {
        this.logger.logInfo(`Calling listFiles with userId: ${userId}, 
        parentId: ${parentId}, filename: ${filename}`);
        let result = await this.fileModel.find({userId: userId, 
            parentId: parentId, filename: filename});
        this.logger.logInfo(`Returning getFile with result: ${result}`);
        return result;
    }

    async getFileByUserId(userId: string): Promise<FileModel | null> {
        this.logger.logInfo(`Calling getFileByUserId with userId: ${userId}`);
        let result = await this.fileModel.findOne({ userId: userId });
        this.logger.logInfo(`Returning getFileByUserId with result: ${result}`);
        return result;
    }

    async deleteFile(id: string): Promise<FileModel | null> {
        this.logger.logInfo(`Calling deleteFile with id: ${id}`);
        let result = await this.fileModel.findByIdAndDelete(id);
        this.logger.logInfo(`Returning deleteFile with result: ${result}`);
        return result;
    }
}
