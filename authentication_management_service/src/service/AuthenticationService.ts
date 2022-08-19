import IService from "./IService";
import Validation from '@dropbox/common_library/utils/Validation'
import HttpError from "@dropbox/common_library/error/HttpError";
import AuthDataModel from '@dropbox/common_library/models/data/AuthDataModel';
import RedisCache from '@dropbox/common_library/config/redisCache';
import UserModel from '@dropbox/common_library/models/data/UserModel';
import { sign, JwtPayload, verify } from "jsonwebtoken";
import Logger from './../logger/Logger';

export default class AuthenticationService implements IService{
    private redisCache: RedisCache;

    constructor() {
        this.redisCache = new RedisCache('authentication_cache', 6379);
    }

    async createAccessToken(user: UserModel) {
        Logger.logInfo(`Calling createAccessToken with user: ${user}`);
        let jwtPayload: JwtPayload = {
            id: user._id,
            username: user.username
        };
        user.access_token = sign(
            jwtPayload,
            process.env.ACCESS_TOKEN_KET!,
            { expiresIn: '1d' }
        );
        await this.redisCache.hSet(user._id, "access_token", user.access_token);
        let result = { id: user._id, access_token: user.access_token };
        Logger.logInfo(`Returning createAccessToken with result ${result}`);
        return result;
    }

    async validateAccessToken(bearer: string) {
        Logger.logInfo(`Calling validateAccessToken with bearer: ${bearer}`);
        let access_token = bearer.split(' ')[1];
        let userId = await this.parseAccessTokenAndGetUserId(bearer);
        let cachedAccessToken = await this.redisCache.hGet(userId, "access_token");

        if(cachedAccessToken && cachedAccessToken === access_token) {
            Logger.logInfo(`Returning validateAccessToken with userId: ${userId}`);
            return userId;
        }
        throw new HttpError(400, "Invalid access token");
    }

    async invalidateAccessToken(bearer: string) {
        Logger.logInfo(`Calling invalidateAccessToken with bearer: ${bearer}`);
        let userId = await this.parseAccessTokenAndGetUserId(bearer);
        let result = await this.invalidateAccessTokenForUser(userId);
        Logger.logInfo(`Returning invalidateAccessToken with result: ${result}`);
        return result;
    }

    async invalidateAccessTokenForUser(userId: string) {
        Logger.logInfo(`Calling invalidateAccessTokenForUser with userId: ${userId}`);
        let result = await this.redisCache.hRemove(userId, "access_token");
        Logger.logInfo(`Returning invalidateAccessTokenForUser with result: ${result}`);
        return result;
    }

    async parseAccessTokenAndGetUserId(bearer: string) {
        Logger.logInfo(`Calling parseAccessTokenAndGetUserId with bearer: ${bearer}`);
        let access_token = bearer.split(' ')[1];
        if(!Validation.validateString(access_token)) {
            throw new HttpError(400, "Invalid access token");
        }
        const decode = verify(access_token, process.env.ACCESS_TOKEN_KET!);
        let authData = new AuthDataModel(bearer, decode as JwtPayload);
        Logger.logInfo(`Returning parseAccessTokenAndGetUserId with userId: ${authData.jwtPayload.id}`);
        return authData.jwtPayload.id;
    }

    // private async getUser(_userId: string) {
    //     // Get user from UserManagementService
    //     return new UserModel("", "", "");
    // }
}
