import { Model } from "mongoose";
import MetadataModel from "../model/MetadataModel";
import MongoMetadataModel from "../model/mongo/MongoMetadataModel";
import IRepository from "./IRepository";

export default class MetadataRepository implements IRepository {
    private metadataModel: Model<MetadataModel>;

    constructor() {
        this.metadataModel = new MongoMetadataModel().metadataModel;
    }

    public async saveMetadata(metadata: MetadataModel): Promise<MetadataModel> {
        let newMetadata = new this.metadataModel(metadata);
        return await newMetadata.save();
    }

    public async getMetadata(id: string): Promise<MetadataModel | null>{
        return await this.metadataModel.findById(id);
    }

    public async deleteMetadata(id: string): Promise<MetadataModel | null> {
        return await this.metadataModel.findByIdAndDelete(id);
    }

    public async getMetadataByResourceId(resourceId: string): Promise<MetadataModel | null> {
        return await this.metadataModel.findOne({ resourceId: resourceId });
    }

}