import { Model } from "mongoose";
import DirectoryModel from "@dropbox/common_library/models/data/DirectoryModel";
import MongoDirectoryModel from "@dropbox/common_library/models/mongo/MongoDirectoryModel";
import IRepository from "./IRepository";
import Logger from './../logger/Logger';

export default class DirectoryRepository implements IRepository {
    private directoryModel: Model<DirectoryModel>;

    constructor() {
        this.directoryModel = MongoDirectoryModel.directoryModel;
    }

    public async saveDirectory(directory: DirectoryModel): Promise<DirectoryModel> {
        Logger.logInfo(`Calling saveDirectory with directory: ${directory}`);
        let newDirectory = new this.directoryModel(directory);
        let result = await newDirectory.save();
        Logger.logInfo(`Returning saveDirectory with result: ${result}`);
        return result;
    }

    public async getDirectory(id: string): Promise<DirectoryModel | null>{
        Logger.logInfo(`Calling getDirectory with id: ${id}`);
        let result = await this.directoryModel.findById(id);
        Logger.logInfo(`Returning getDirectory with result: ${result}`);
        return result;
    }

    public async listDirectory(userId: string, parentId?: string): Promise<DirectoryModel[]> {
        Logger.logInfo(`Calling listDirectory with userId: ${userId}, parentId: ${parentId}`);
        let result = await this.directoryModel.find({ userId: userId, parentId: parentId});
        Logger.logInfo(`Returning listDirectory with result: ${result}`);
        return result;
    }

    public async deleteDirectory(id: string): Promise<DirectoryModel | null> {
        Logger.logInfo(`Calling deleteDirectory with metadata: ${id}`);
        let result = await this.directoryModel.findByIdAndDelete(id);
        Logger.logInfo(`Returning deleteDirectory with result: ${result}`);
        return result;
    }
}
