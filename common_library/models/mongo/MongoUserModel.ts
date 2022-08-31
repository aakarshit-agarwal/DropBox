import { Model, model, Schema } from "mongoose";
import UserModel from "../data/UserModel";

class MongoUserModel {
    public userModel: Model<UserModel>;

    constructor() {
        let userSchema = new Schema({
            _id: {type: String, required: true},
            username: {type: String, required: true},
            name: {type: String, required: false},
            password: {type: String, required: true},
            access_token: {type: String, required: false},
            createdAt: {type: Date, required: true},
            createdBy: {type: String, required: true},
            updatedAt: {type: Date, required: false},
            updatedBy: {type: String, required: false},
        });
        this.userModel = model<UserModel>('User', userSchema);
    }
}

export default new MongoUserModel();