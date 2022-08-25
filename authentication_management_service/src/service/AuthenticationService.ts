import IService from "./IService";
import HttpError from "@dropbox/common_library/error/HttpError";
import RedisCache from '@dropbox/common_library/components/cache/RedisCache';
import UserModel from '@dropbox/common_library/models/data/UserModel';
import { sign, JwtPayload } from "jsonwebtoken";
import Logging from "@dropbox/common_library/logging/Logging";
import Authentication from "@dropbox/common_library/middlewares/Authentication";
import AuthenticationRepository from "../repository/AuthenticationRepository";
import AuthenticationModel from "@dropbox/common_library/models/data/AuthenticationModel";

export default class AuthenticationService implements IService{
    private authenticationRepository: AuthenticationRepository;
    private applicationContext: any;
    private cache: RedisCache;
    private logger: Logging;

    constructor(applicationContext: any) {
        this.applicationContext = applicationContext;
        this.logger = this.applicationContext.logger;
        this.cache = this.applicationContext.cache;
        this.authenticationRepository = new AuthenticationRepository(this.applicationContext);
    }

    async createAccessToken(user: UserModel) {
        this.logger.logInfo(`Calling createAccessToken with user: ${user}`);
        let jwtPayload: JwtPayload = {
            id: user._id,
            username: user.username
        };
        user.access_token = sign(
            jwtPayload,
            process.env.ACCESS_TOKEN_KEY!,
            { expiresIn: process.env.ACCESS_TOKEN_VALIDITY! }
        );
        let newAuthentication: AuthenticationModel = {
            userId: user._id,
            access_token: user.access_token
        };
        let result = await this.authenticationRepository.saveAuthentication(newAuthentication);
        await this.cache.hSet(user._id, "access_token", newAuthentication.access_token);
        this.logger.logInfo(`Returning createAccessToken with result ${result}`);
        return result;
    }

    async validateAccessToken(bearer: string) {
        this.logger.logInfo(`Calling validateAccessToken with bearer: ${bearer}`);
        let userId = await Authentication.parseBearerTokenAndGetUserId(bearer);
        let cachedAccessToken = await this.getOrLoadCache(userId);
        let received_access_token = bearer.split(' ')[1];
        if(cachedAccessToken === received_access_token) {
            this.logger.logInfo(`Returning validateAccessToken with userId: ${userId}`);
            return userId;
        }
        throw new HttpError(400, "Invalid access token");
    }

    async invalidateAccessToken(bearer: string) {
        this.logger.logInfo(`Calling invalidateAccessToken with bearer: ${bearer}`);
        let userId = await Authentication.parseBearerTokenAndGetUserId(bearer);
        let result = await this.invalidateAccessTokenForUser(userId);
        this.logger.logInfo(`Returning invalidateAccessToken with result: ${result}`);
        return result;
    }

    async invalidateAccessTokenForUser(userId: string) {
        this.logger.logInfo(`Calling invalidateAccessTokenForUser with userId: ${userId}`);
        await this.cache.hRemove(userId, "access_token");
        let result = await this.authenticationRepository.deleteAuthentication(userId);
        this.logger.logInfo(`Returning invalidateAccessTokenForUser with result: ${result}`);
        return result;
    }

    private async getOrLoadCache(userId: string) {
        let cachedAccessToken = await this.cache.hGet(userId, "access_token");
        if(cachedAccessToken && cachedAccessToken.length > 0) {
            return cachedAccessToken;
        }
        let authentication = await this.authenticationRepository.getAuthentication(userId);
        if(!authentication) {
            throw new HttpError(400, "Invalid user.");
        }
        if(!authentication.access_token && await Authentication.authenticateAccessToken(authentication.access_token)) {
            throw new HttpError(400, "User logged out.");
        }
        await this.cache.hSet(userId, "access_token", authentication.access_token);
        return authentication.access_token;
    }
}
