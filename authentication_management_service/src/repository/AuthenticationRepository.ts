import { Model } from "mongoose";
import AuthenticationModel from "@dropbox/common_library/models/data/AuthenticationModel";
import MongoAuthenticationModel from "@dropbox/common_library/models/mongo/MongoAuthenticationModel";
import Logging from "@dropbox/common_library/logging/Logging";

export default class AuthenticationRepository {
    private logger: Logging;
    public authenticationModel: Model<AuthenticationModel>;

    constructor(applicationContext: any) {
        this.logger = applicationContext.logger;
        this.authenticationModel = MongoAuthenticationModel.authenticationModel;
    }

    public async saveAuthentication(authentication: AuthenticationModel): Promise<AuthenticationModel> {
        this.logger.logInfo(`Calling saveAuthentication with Authentication: ${authentication}`);
        let newAuthentication = new this.authenticationModel(authentication);
        let result = await newAuthentication.save();
        this.logger.logInfo(`Returning saveAuthentication with result: ${result}`);
        return result;
    }

    public async getAuthentication(userId: string): Promise<AuthenticationModel | null>{
        this.logger.logInfo(`Calling getAuthentication with userId: ${userId}`);
        let result = await this.authenticationModel.findOne({userId: userId});
        this.logger.logInfo(`Returning getAuthentication with result: ${result}`);
        return result;
    }

    public async deleteAuthentication(userId: string) {
        this.logger.logInfo(`Calling deleteAuthentication with userId: ${userId}`);
        let result = await this.authenticationModel.findOneAndDelete({userId: userId});
        this.logger.logInfo(`Returning deleteAuthentication with result: ${result}`);
        return result;
    }
}
