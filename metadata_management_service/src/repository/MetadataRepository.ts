import { Model } from "mongoose";
import MetadataModel from '@dropbox/common_library/models/data/MetadataModel';
import MongoMetadataModel from '@dropbox/common_library/models/mongo/MongoMetadataModel';
import IRepository from "./IRepository";
import Logger from './../logger/Logger';

export default class MetadataRepository implements IRepository {
    private metadataModel: Model<MetadataModel>;

    constructor() {
        this.metadataModel = MongoMetadataModel.metadataModel;
    }

    public async saveMetadata(metadata: MetadataModel): Promise<MetadataModel> {
        Logger.logInfo(`Calling saveMetadata with metadata: ${metadata}`);
        let newMetadata = new this.metadataModel(metadata);
        let result = await newMetadata.save();
        Logger.logInfo(`Returning saveMetadata with result: ${result}`);
        return result;
    }

    public async getMetadata(id: string): Promise<MetadataModel | null>{
        Logger.logInfo(`Calling getMetadata with id: ${id}`);
        let result = await this.metadataModel.findById(id);
        Logger.logInfo(`Returning getMetadata with result: ${result}`);
        return result;
    }

    public async deleteMetadata(id: string): Promise<MetadataModel | null> {
        Logger.logInfo(`Calling deleteMetadata with id: ${id}`);
        let result = await this.metadataModel.findByIdAndDelete(id);
        Logger.logInfo(`Returning deleteMetadata with result: ${result}`);
        return result;
    }

    public async getMetadataByResourceId(resourceId: string): Promise<MetadataModel | null> {
        Logger.logInfo(`Calling getMetadataByResourceId with resourceId: ${resourceId}`);
        let result = await this.metadataModel.findOne({ resourceId: resourceId });
        Logger.logInfo(`Returning getMetadataByResourceId with result: ${result}`);
        return result;
    }

}
