import { Model, model, Schema } from "mongoose";
import UserModel from "./../data/UserModel";

export default class MongoUserModel {
    public userModel: Model<UserModel>;

    constructor() {
        let userSchema = new Schema({
            _id: {type: String, required: true},
            username: {type: String, required: true},
            name: {type: String, required: false},
            password: {type: String, required: true},
            access_token: {type: String, required: false}
        });
        this.userModel = model<UserModel>('User', userSchema);
    }
}
