import { Model, model, Schema } from "mongoose";
import DirectoryModel from "../data/DirectoryModel";

class MongoDirectoryModel {

    public directoryModel: Model<DirectoryModel>;

    constructor() {
        let userSchema = new Schema({
            _id: {type: String, required: true},
            files: [{type: String, required: false}],
            directories: [{type: String, required: false}],
            metadataId: {type: String, required: false},
            parentId: {type: String, required: true},
            userId: {type: String, required: true}
        });
        this.directoryModel = model<DirectoryModel>('Directory', userSchema);
        this.directoryModel.collection.createIndex({ userId: 1 }, { unique: true });    // userId & id combination is unique
    }

}

export default new MongoDirectoryModel();
