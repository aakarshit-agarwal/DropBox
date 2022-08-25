import { Model, model, Schema } from "mongoose";
import AuthenticationModel from "../data/AuthenticationModel";

class MongoAuthenticationModel {

    public authenticationModel: Model<AuthenticationModel>;

    constructor() {
        let authenticationSchema = new Schema({
            userId: {type: String, required: true},
            access_token: {type: String, required: false}
        });
        this.authenticationModel = model<AuthenticationModel>('Authentication', authenticationSchema);
        this.authenticationModel.collection.createIndex({ userId: 1 }, { unique: true });
    }

}

export default new MongoAuthenticationModel();
