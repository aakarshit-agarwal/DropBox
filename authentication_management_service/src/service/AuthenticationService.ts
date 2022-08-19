import IService from "./IService";
import Validation from '@dropbox/common_library/utils/Validation'
import HttpError from "@dropbox/common_library/error/HttpError";
import AuthDataModel from '@dropbox/common_library/models/data/AuthDataModel';
import RedisCache from '@dropbox/common_library/config/redisCache';
import UserModel from '@dropbox/common_library/models/data/UserModel';
import UserStateModel from "@dropbox/common_library/models/data/UserStateModel";
import { sign, JwtPayload, verify } from "jsonwebtoken";

export default class AuthenticationService implements IService{
    private redisCache: RedisCache;

    constructor() {
        this.redisCache = new RedisCache('authentication_cache', 6379);
    }

    async createAccessToken(user: UserModel) {
        let jwtPayload: JwtPayload = {
            id: user._id,
            username: user.username
        };
        user.access_token = sign(
            jwtPayload,
            process.env.ACCESS_TOKEN_KET!,
            { expiresIn: '1d' }
        );
        await this.redisCache.set(user.access_token, JSON.stringify(user));
        let result = { id: user._id, access_token: user.access_token };
        // Logger.logInfo(`Returning createAccessToken with result ${result}`);
        return result;
    }

    async validateAccessToken(bearer: string) {
        let access_token = bearer.split(' ')[1];
        if(!Validation.validateString(access_token)) {
            throw new HttpError(400, "Invalid access token");
        }
        const decode = verify(access_token, process.env.ACCESS_TOKEN_KET!);
        let authData = new AuthDataModel(bearer, decode as JwtPayload);
        if(!authData.jwtPayload.id) {
            throw new HttpError(400, "Invalid Token User!");
        }
        let cacheUserData: UserModel = JSON.parse(await this.redisCache.get(access_token) as string) as UserModel;
        if(!cacheUserData) {
            throw new HttpError(400, "Invalid User!");
        }
        if(cacheUserData.state == UserStateModel.BLOCKED) {
            throw new HttpError(400, "Blocked User!");
        }
        return cacheUserData._id;
    }

    async invalidateAccessToken(bearer: string) {
        let access_token = bearer.split(' ')[1];
        return await this.redisCache.remove(access_token);
    }

    // private async getUser(_userId: string) {
    //     // Get user from UserManagementService
    //     return new UserModel("", "", "");
    // }
}