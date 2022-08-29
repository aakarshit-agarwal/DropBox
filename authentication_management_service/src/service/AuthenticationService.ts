import IService from "./IService";
import HttpError from "@dropbox/common_library/error/HttpError";
import RedisCache from '@dropbox/common_library/components/cache/RedisCache';
import UserModel from '@dropbox/common_library/models/data/UserModel';
import { sign, JwtPayload, verify } from "jsonwebtoken";
import Logging from "@dropbox/common_library/logging/Logging";
import AuthenticationRepository from "../repository/AuthenticationRepository";
import AuthenticationModel from "@dropbox/common_library/models/data/AuthenticationModel";
import AuthDataModel from "@dropbox/common_library/models/data/AuthDataModel";
import EventPublisher from "./../events/EventPublisher";

export default class AuthenticationService implements IService{
    private logger: Logging;
    private authenticationRepository: AuthenticationRepository;
    private cache: RedisCache;
    // private eventPublisher: EventPublisher;
 
    constructor(logger: Logging, authenticationRepository: AuthenticationRepository, cache: RedisCache, _eventPublisher: EventPublisher) {
        this.logger = logger;
        this.authenticationRepository = authenticationRepository;
        this.cache = cache;
        // this.eventPublisher = eventPublisher;
    }

    // Here input user is trusted to have correct data as this is an internal API.
    async createAccessToken(user: UserModel) {
        this.logger.logDebug(`Calling createAccessToken with user: ${user}`);

        // Logic
        let jwtPayload: JwtPayload = {
            id: user._id,
            username: user.username
        };
        user.access_token = sign(
            jwtPayload,
            process.env.ACCESS_TOKEN_KEY!,
            { expiresIn: process.env.ACCESS_TOKEN_VALIDITY! }
        );
        let AuthenticationModel: AuthenticationModel = {
            userId: user._id,
            access_token: user.access_token
        };
        await this.invalidateAccessTokenForUser(user._id);
        let authentication = await this.authenticationRepository.saveAuthentication(AuthenticationModel);
        await this.cache.hSet(user._id, "access_token", AuthenticationModel.access_token);
        this.logger.logInfo(`Access token created for [userId=${user._id}]`);

        let result = {
            userId: authentication.userId,
            access_token: authentication.access_token
        }
        this.logger.logDebug(`Returning createAccessToken with result ${result}`);
        return result;
    }

    async validateAccessToken(access_token: string) {
        this.logger.logDebug(`Calling validateAccessToken with access_token: ${access_token}`);

        // Logic
        let authData = await this.parseAccessTokenAndGetAuthData(access_token);
        let cachedAccessToken = await this.getOrLoadCache(authData.jwtPayload.id);

        // Validations
        if(cachedAccessToken !== access_token) {
            throw new HttpError(400, "Invalid access token");
        }

        this.logger.logDebug(`Returning validateAccessToken with authData: ${authData}`);
        return authData;
}

    async invalidateAccessToken(access_token: string) {
        this.logger.logDebug(`Calling invalidateAccessToken with access_token: ${access_token}`);

        // Logic
        let authData = await this.parseAccessTokenAndGetAuthData(access_token);
        let authentication = await this.authenticationRepository.getAuthentication(authData.jwtPayload.id);
        if(!authentication || authentication.access_token !== access_token) {
            throw new HttpError(400, "Invalid access token");
        }
        let result = await this.invalidateAccessTokenForUser(authData.jwtPayload.id);

        this.logger.logDebug(`Returning invalidateAccessToken with result: ${result}`);
        return result;
    }

    async invalidateAccessTokenForUser(userId: string) {
        this.logger.logDebug(`Calling invalidateAccessTokenForUser with userId: ${userId}`);

        // Logic
        await this.cache.hRemove(userId, "access_token");
        await this.authenticationRepository.deleteAuthentication(userId);

        let result = {
            userId: userId
        }
        this.logger.logDebug(`Returning invalidateAccessTokenForUser with result: ${result}`);
        return result;
    }

    private async getOrLoadCache(userId: string) {
        let cachedAccessToken = await this.cache.hGet(userId, "access_token");
        if(!cachedAccessToken) {
            let authentication = await this.authenticationRepository.getAuthentication(userId);
            if(!authentication || !authentication.access_token || !await this.parseAccessTokenAndGetAuthData(authentication.access_token)) {
                throw new HttpError(400, "Invalid access token");
            }
            await this.cache.hSet(userId, "access_token", authentication.access_token);
            cachedAccessToken = authentication.access_token;
        }
        return cachedAccessToken;
    }

    private async parseAccessTokenAndGetAuthData(access_token: string) {
        try {
            return new AuthDataModel(access_token, verify(access_token, process.env.ACCESS_TOKEN_KEY!) as JwtPayload);
        } catch(e: any) {
            throw new HttpError(400, "Invalid access token");
        }
    }
}
