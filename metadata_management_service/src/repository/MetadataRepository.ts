import MetadataModel from '@dropbox/common_library/models/data/MetadataModel';
import MongoMetadataModel from '@dropbox/common_library/models/mongo/MongoMetadataModel';
import IRepository from "./IRepository";
import Logging from "@dropbox/common_library/logging/Logging";

export default class MetadataRepository implements IRepository {
    private logger: Logging;

    constructor(logger: Logging) {
        this.logger = logger;
    }

    public async saveMetadata(metadata: MetadataModel): Promise<MetadataModel> {
        this.logger.logInfo(`Calling saveMetadata with metadata: ${metadata}`);
        let newMetadata = new MongoMetadataModel.metadataModel(metadata);
        let result = await newMetadata.save();
        this.logger.logInfo(`Returning saveMetadata with result: ${result}`);
        return result;
    }

    public async getMetadata(id: string): Promise<MetadataModel | null>{
        this.logger.logInfo(`Calling getMetadata with id: ${id}`);
        let result = await MongoMetadataModel.metadataModel.findById(id);
        this.logger.logInfo(`Returning getMetadata with result: ${result}`);
        return result;
    }

    public async deleteMetadata(id: string): Promise<MetadataModel | null> {
        this.logger.logInfo(`Calling deleteMetadata with id: ${id}`);
        let result = await MongoMetadataModel.metadataModel.findByIdAndDelete(id);
        this.logger.logInfo(`Returning deleteMetadata with result: ${result}`);
        return result;
    }

    public async getMetadataByResourceId(resourceId: string): Promise<MetadataModel | null> {
        this.logger.logInfo(`Calling getMetadataByResourceId with resourceId: ${resourceId}`);
        let result = await MongoMetadataModel.metadataModel.findOne({ resourceId: resourceId });
        this.logger.logInfo(`Returning getMetadataByResourceId with result: ${result}`);
        return result;
    }

}
