import UserModel from "@dropbox/common_library/models/data/UserModel";
import MongoUserModel from "@dropbox/common_library/models/mongo/MongoUserModel";
import Logging from "@dropbox/common_library/logging/Logging";

export default class UserRepository {
    private logger: Logging;

    constructor(logger: Logging) {
        this.logger = logger;
    }

    public async saveUser(user: UserModel): Promise<UserModel> {
        this.logger.logDebug(`Calling saveUser with user: ${user}`);
        let newUser = new MongoUserModel.userModel(user);
        let result = await newUser.save();
        this.logger.logDebug(`Returning saveUser with result: ${result}`);
        return result;
    }

    public async getUser(id: string): Promise<UserModel | null>{
        this.logger.logDebug(`Calling getUser with id: ${id}`);
        let result = await MongoUserModel.userModel.findById(id);
        this.logger.logDebug(`Returning getUser with result: ${result}`);
        return result;
    }

    public async deleteUser(id: string) {
        this.logger.logDebug(`Calling deleteUser with id: ${id}`);
        let result = await MongoUserModel.userModel.findByIdAndDelete(id);
        this.logger.logDebug(`Returning deleteUser with result: ${result}`);
        return result;
    }

    public async getUserByUsername(username: string): Promise<UserModel | null> {
        this.logger.logDebug(`Calling getUserByUsername with username: ${username}`);
        let result = await MongoUserModel.userModel.findOne({ username: username });
        this.logger.logDebug(`Returning getUserByUsername with result: ${result}`);
        return result;
    }
}
