import DirectoryModel from "@dropbox/common_library/models/data/DirectoryModel";
import MongoDirectoryModel from "@dropbox/common_library/models/mongo/MongoDirectoryModel";
import IRepository from "./IRepository";
import Logging from "@dropbox/common_library/logging/Logging";
import ListDirectoriesRequestModel from "@dropbox/common_library/models/dto/ListDirectoriesRequestModel";

export default class DirectoryRepository implements IRepository {
    private logger: Logging;

    constructor(logger: Logging) {
        this.logger = logger;
    }

    public async saveDirectory(directory: DirectoryModel): Promise<DirectoryModel> {
        this.logger.logInfo(`Calling saveDirectory with directory: ${directory}`);
        let newDirectory = new MongoDirectoryModel.directoryModel(directory);
        let result = await newDirectory.save();
        this.logger.logInfo(`Returning saveDirectory with result: ${result}`);
        return result;
    }

    public async getDirectory(id: string): Promise<DirectoryModel | null>{
        this.logger.logInfo(`Calling getDirectory with id: ${id}`);
        let result = await MongoDirectoryModel.directoryModel.findById(id);
        this.logger.logInfo(`Returning getDirectory with result: ${result}`);
        return result;
    }

    public async listDirectory(userId: string, queryParams: ListDirectoriesRequestModel): Promise<DirectoryModel[]> {
        this.logger.logInfo(`Calling listDirectory with userId: ${userId}, queryParams: ${queryParams}`);
        let result = await MongoDirectoryModel.directoryModel.find({ owner: userId, parentId: queryParams.parentId, type: queryParams.type});
        this.logger.logInfo(`Returning listDirectory with result: ${result}`);
        return result;
    }

    public async deleteDirectory(id: string): Promise<DirectoryModel | null> {
        this.logger.logInfo(`Calling deleteDirectory with metadata: ${id}`);
        let result = await MongoDirectoryModel.directoryModel.findByIdAndDelete(id);
        this.logger.logInfo(`Returning deleteDirectory with result: ${result}`);
        return result;
    }
}
