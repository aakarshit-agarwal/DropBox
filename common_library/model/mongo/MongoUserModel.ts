import { Model, model, Schema } from "mongoose";
import IUser from "../IUser";

export default class MongoUserModel {
    public userModel: Model<IUser>;

    constructor() {
        let userSchema = new Schema({
            _id: {type: String, required: true},
            username: {type: String, required: true},
            name: {type: String, required: false},
            password: {type: String, required: true},
            access_token: {type: String, required: false}
        });
        this.userModel = model<IUser>('User', userSchema);
    }
}
