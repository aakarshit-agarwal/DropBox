import { Model } from "mongoose";
import DirectoryModel from "@dropbox/common_library/models/data/DirectoryModel";
import MongoDirectoryModel from "@dropbox/common_library/models/mongo/MongoDirectoryModel";
import IRepository from "./IRepository";
import Logging from "@dropbox/common_library/logging/Logging";

export default class DirectoryRepository implements IRepository {
    private applicationContext: any;
    private logger: Logging;
    private directoryModel: Model<DirectoryModel>;

    constructor(applicationContext: any) {
        this.applicationContext = applicationContext;
        this.logger = this.applicationContext.logger;
        this.directoryModel = MongoDirectoryModel.directoryModel;
    }

    public async saveDirectory(directory: DirectoryModel): Promise<DirectoryModel> {
        this.logger.logInfo(`Calling saveDirectory with directory: ${directory}`);
        let newDirectory = new this.directoryModel(directory);
        let result = await newDirectory.save();
        this.logger.logInfo(`Returning saveDirectory with result: ${result}`);
        return result;
    }

    public async getDirectory(id: string): Promise<DirectoryModel | null>{
        this.logger.logInfo(`Calling getDirectory with id: ${id}`);
        let result = await this.directoryModel.findById(id);
        this.logger.logInfo(`Returning getDirectory with result: ${result}`);
        return result;
    }

    public async listDirectory(userId: string, parentId?: string): Promise<DirectoryModel[]> {
        this.logger.logInfo(`Calling listDirectory with userId: ${userId}, parentId: ${parentId}`);
        let result = await this.directoryModel.find({ userId: userId, parentId: parentId});
        this.logger.logInfo(`Returning listDirectory with result: ${result}`);
        return result;
    }

    public async deleteDirectory(id: string): Promise<DirectoryModel | null> {
        this.logger.logInfo(`Calling deleteDirectory with metadata: ${id}`);
        let result = await this.directoryModel.findByIdAndDelete(id);
        this.logger.logInfo(`Returning deleteDirectory with result: ${result}`);
        return result;
    }
}
