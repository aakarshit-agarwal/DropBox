import { Model } from "mongoose";
import UserModel from "@dropbox/common_library/models/data/UserModel";
import MongoUserModel from "@dropbox/common_library/models/mongo/MongoUserModel";

export default class UserRepository {

    public userModel: Model<UserModel>;

    constructor() {
        this.userModel = new MongoUserModel().userModel;
    }

    public async saveUser(user: UserModel): Promise<UserModel> {
        let newUser = new this.userModel(user);
        return await newUser.save();
    }

    public async getUser(id: string): Promise<UserModel | null>{
        return await this.userModel.findById(id);
    }

    public async deleteUser(id: string) {
        return await this.userModel.findByIdAndDelete(id);
    }

    public async getUserByUsername(username: string): Promise<UserModel | null> {
        return await this.userModel.findOne({ username: username });
    }

}
