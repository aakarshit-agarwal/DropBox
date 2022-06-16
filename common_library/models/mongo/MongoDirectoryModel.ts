import { Model, model, Schema } from "mongoose";
import DirectoryModel from "../data/DirectoryModel";

export default class MongoDirectoryModel {

    public directoryModel: Model<DirectoryModel>;

    constructor() {
        let userSchema = new Schema({
            _id: {type: String, required: true},
            files: [{type: String, required: false}],
            directories: [{type: String, required: false}],
            metadataId: {type: String, required: true},
            parentId: {type: String, required: true}
        });
        this.directoryModel = model<DirectoryModel>('Directory', userSchema);
    }

}
