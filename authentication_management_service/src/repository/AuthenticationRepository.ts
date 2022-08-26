import AuthenticationModel from "@dropbox/common_library/models/data/AuthenticationModel";
import MongoAuthenticationModel from "@dropbox/common_library/models/mongo/MongoAuthenticationModel";
import Logging from "@dropbox/common_library/logging/Logging";

export default class AuthenticationRepository {
    private logger: Logging;

    constructor(logger: Logging) {
        this.logger = logger;
    }

    public async saveAuthentication(authentication: AuthenticationModel): Promise<AuthenticationModel> {
        this.logger.logInfo(`Calling saveAuthentication with Authentication: ${authentication}`);
        let newAuthentication = new MongoAuthenticationModel.authenticationModel(authentication);
        let result = await newAuthentication.save();
        this.logger.logInfo(`Returning saveAuthentication with result: ${result}`);
        return result;
    }

    public async getAuthentication(userId: string): Promise<AuthenticationModel | null>{
        this.logger.logInfo(`Calling getAuthentication with userId: ${userId}`);
        let result = await MongoAuthenticationModel.authenticationModel.findOne({userId: userId});
        this.logger.logInfo(`Returning getAuthentication with result: ${result}`);
        return result;
    }

    public async deleteAuthentication(userId: string) {
        this.logger.logInfo(`Calling deleteAuthentication with userId: ${userId}`);
        let result = await MongoAuthenticationModel.authenticationModel.findOneAndDelete({userId: userId});
        this.logger.logInfo(`Returning deleteAuthentication with result: ${result}`);
        return result;
    }
}
