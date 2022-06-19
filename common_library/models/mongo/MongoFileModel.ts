import { Model, model, Schema } from "mongoose";
import FileModel from "../data/FileModel";

class MongoFileModel {

    public fileModel: Model<FileModel>;

    constructor() {
        let fileSchema = new Schema({
            _id: {type: String, required: true},
            filename: {type: String, required: true},
            fileHash: {type: String, required: true},
            userId: {type: String, required: true},
            parentId: {type: String, required: true}
        });
        this.fileModel = model<FileModel>('File', fileSchema);
        this.fileModel.collection.createIndex({ parentId: 1 }, { unique: false });
    }

}

export default new MongoFileModel();
