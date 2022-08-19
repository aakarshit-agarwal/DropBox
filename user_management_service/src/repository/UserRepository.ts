import { Model } from "mongoose";
import UserModel from "@dropbox/common_library/models/data/UserModel";
import MongoUserModel from "@dropbox/common_library/models/mongo/MongoUserModel";
import Logger from './../logger/Logger';

export default class UserRepository {

    public userModel: Model<UserModel>;

    constructor() {
        this.userModel = MongoUserModel.userModel;
    }

    public async saveUser(user: UserModel): Promise<UserModel> {
        Logger.logInfo(`Calling saveUser with user: ${user}`);
        let newUser = new this.userModel(user);
        let result = await newUser.save();
        Logger.logInfo(`Returning saveUser with result: ${result}`);
        return result;
    }

    public async getUser(id: string): Promise<UserModel | null>{
        Logger.logInfo(`Calling getUser with id: ${id}`);
        let result = await this.userModel.findById(id);
        Logger.logInfo(`Returning getUser with result: ${result}`);
        return result;
    }

    public async deleteUser(id: string) {
        Logger.logInfo(`Calling deleteUser with id: ${id}`);
        let result = await this.userModel.findByIdAndDelete(id);
        Logger.logInfo(`Returning deleteUser with result: ${result}`);
        return result;
    }

    public async getUserByUsername(username: string): Promise<UserModel | null> {
        Logger.logInfo(`Calling getUserByUsername with username: ${username}`);
        let result = await this.userModel.findOne({ username: username });
        Logger.logInfo(`Returning getUserByUsername with result: ${result}`);
        return result;
    }

}
