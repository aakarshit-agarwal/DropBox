import { Model } from "mongoose";
import FileModel from '@dropbox/common_library/models/data/FileModel';
import MongoFileModel from '@dropbox/common_library/models/mongo/MongoFileModel';
import IRepository from "./IRepository";
import Logger from '../logger/Logger';

export default class FileRepository implements IRepository {
    private fileModel: Model<FileModel>;

    constructor() {
        this.fileModel = MongoFileModel.fileModel;
    }

    async saveFiles(files: FileModel[]): Promise<FileModel[]> {
        Logger.logInfo(`Calling saveFile with file: ${JSON.stringify(files)}`);
        let result: FileModel[] = [];
        files.forEach(async file => {
            let newFile = new this.fileModel(file);
            result.push(await newFile.save());
        });
        Logger.logInfo(`Returning saveFile with result: ${result}`);
        return result;
    }

    async getFile(id: string): Promise<FileModel | null> {
        Logger.logInfo(`Calling getFile with id: ${id}`);
        let result = await this.fileModel.findById(id);
        Logger.logInfo(`Returning getFile with result: ${result}`);
        return result;
    }

    async listFiles(userId: string, parentId?: string, filename?: 
        string): Promise<FileModel[]> {
        Logger.logInfo(`Calling listFiles with userId: ${userId}, 
        parentId: ${parentId}, filename: ${filename}`);
        let result = await this.fileModel.find({userId: userId, 
            parentId: parentId, filename: filename});
        Logger.logInfo(`Returning getFile with result: ${result}`);
        return result;
    }

    async getFileByUserId(userId: string): Promise<FileModel | null> {
        Logger.logInfo(`Calling getFileByUserId with userId: ${userId}`);
        let result = await this.fileModel.findOne({ userId: userId });
        Logger.logInfo(`Returning getFileByUserId with result: ${result}`);
        return result;
    }

    async deleteFile(id: string): Promise<FileModel | null> {
        Logger.logInfo(`Calling deleteFile with id: ${id}`);
        let result = await this.fileModel.findByIdAndDelete(id);
        Logger.logInfo(`Returning deleteFile with result: ${result}`);
        return result;
    }

}
