import { Model } from "mongoose";
import DirectoryModel from "@dropbox/common_library/models/data/DirectoryModel";
import MongoDirectoryModel from "@dropbox/common_library/models/mongo/MongoDirectoryModel";
import IRepository from "./IRepository";

export default class DirectoryRepository implements IRepository {
    private directoryModel: Model<DirectoryModel>;

    constructor() {
        this.directoryModel = new MongoDirectoryModel().directoryModel;
    }

    public async saveDirectory(directory: DirectoryModel): Promise<DirectoryModel> {
        let newDirectory = new this.directoryModel(directory);
        return await newDirectory.save();
    }

    public async getDirectory(id: string): Promise<DirectoryModel | null>{
        return await this.directoryModel.findById(id);
    }

    public async deleteDirectory(id: string): Promise<DirectoryModel | null> {
        return await this.directoryModel.findByIdAndDelete(id);
    }
}
