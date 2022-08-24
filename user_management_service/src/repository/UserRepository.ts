import { Model } from "mongoose";
import UserModel from "@dropbox/common_library/models/data/UserModel";
import MongoUserModel from "@dropbox/common_library/models/mongo/MongoUserModel";
import Logging from "@dropbox/common_library/logging/Logging";

export default class UserRepository {
    private logger: Logging;

    public userModel: Model<UserModel>;

    constructor(applicationContext: any) {
        this.logger = applicationContext.logger;
        this.userModel = MongoUserModel.userModel;
    }

    public async saveUser(user: UserModel): Promise<UserModel> {
        this.logger.logInfo(`Calling saveUser with user: ${user}`);
        let newUser = new this.userModel(user);
        let result = await newUser.save();
        this.logger.logInfo(`Returning saveUser with result: ${result}`);
        return result;
    }

    public async getUser(id: string): Promise<UserModel | null>{
        this.logger.logInfo(`Calling getUser with id: ${id}`);
        let result = await this.userModel.findById(id);
        this.logger.logInfo(`Returning getUser with result: ${result}`);
        return result;
    }

    public async deleteUser(id: string) {
        this.logger.logInfo(`Calling deleteUser with id: ${id}`);
        let result = await this.userModel.findByIdAndDelete(id);
        this.logger.logInfo(`Returning deleteUser with result: ${result}`);
        return result;
    }

    public async getUserByUsername(username: string): Promise<UserModel | null> {
        this.logger.logInfo(`Calling getUserByUsername with username: ${username}`);
        let result = await this.userModel.findOne({ username: username });
        this.logger.logInfo(`Returning getUserByUsername with result: ${result}`);
        return result;
    }

}
