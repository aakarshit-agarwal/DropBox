import { Model, model, Schema } from "mongoose";
import MetadataModel from "./../data/MetadataModel";

class MongoMetadataModel {

    public metadataModel: Model<MetadataModel>;

    constructor() {
        let userSchema = new Schema({
            _id: {type: String, required: true},
            resourceType: {type: String, required: true},
            name: {type: String, required: true},
            resourceId: {type: String, required: true},
            resourceHash: {type: String, required: true},
            uploadedOn: {type: Date, required: true},
            uploadedBy: {type: String, required: false},
            lastAccessedOn: {type: Date, required: false},
            lastAccessedBy: {type: String, required: false}
        });
        this.metadataModel = model<MetadataModel>('Metadata', userSchema);
        this.metadataModel.collection.createIndex({ resourceId: 1 }, { unique: true });
    }

}

export default new MongoMetadataModel();