import { Model } from "mongoose";
import MetadataModel from '@dropbox/common_library/models/data/MetadataModel';
import MongoMetadataModel from '@dropbox/common_library/models/mongo/MongoMetadataModel';
import IRepository from "./IRepository";
import Logging from "@dropbox/common_library/logging/Logging";

export default class MetadataRepository implements IRepository {
    private applicationContext: any;
    private logger: Logging;
    private metadataModel: Model<MetadataModel>;

    constructor(applicationContext: any) {
        this.applicationContext = applicationContext;
        this.logger = this.applicationContext.logger;
        this.metadataModel = MongoMetadataModel.metadataModel;
    }

    public async saveMetadata(metadata: MetadataModel): Promise<MetadataModel> {
        this.logger.logInfo(`Calling saveMetadata with metadata: ${metadata}`);
        let newMetadata = new this.metadataModel(metadata);
        let result = await newMetadata.save();
        this.logger.logInfo(`Returning saveMetadata with result: ${result}`);
        return result;
    }

    public async getMetadata(id: string): Promise<MetadataModel | null>{
        this.logger.logInfo(`Calling getMetadata with id: ${id}`);
        let result = await this.metadataModel.findById(id);
        this.logger.logInfo(`Returning getMetadata with result: ${result}`);
        return result;
    }

    public async deleteMetadata(id: string): Promise<MetadataModel | null> {
        this.logger.logInfo(`Calling deleteMetadata with id: ${id}`);
        let result = await this.metadataModel.findByIdAndDelete(id);
        this.logger.logInfo(`Returning deleteMetadata with result: ${result}`);
        return result;
    }

    public async getMetadataByResourceId(resourceId: string): Promise<MetadataModel | null> {
        this.logger.logInfo(`Calling getMetadataByResourceId with resourceId: ${resourceId}`);
        let result = await this.metadataModel.findOne({ resourceId: resourceId });
        this.logger.logInfo(`Returning getMetadataByResourceId with result: ${result}`);
        return result;
    }

}
