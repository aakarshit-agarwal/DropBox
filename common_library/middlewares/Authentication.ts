import { NextFunction, Request, Response } from "express";
import { JwtPayload, verify } from "jsonwebtoken";
import HttpError from "./../error/HttpError";
import Validation from "../utils/Validation";
import AuthDataModel from "../models/data/AuthDataModel";

export default class Authentication {
    // private accessTokenKey: string;

    constructor() {
        // console.log(access_token_key);
        // if(access_token_key.length === 0) {
        //     console.log("Invalid Access Token Key.", access_token_key);
        // }
        // this.accessTokenKey = access_token_key;
        // console.log(this.accessTokenKey);
    }

    public static async parseAccessTokenAndGetJwtPayload(access_token: string) {
        return verify(access_token, process.env.ACCESS_TOKEN_KEY!) as JwtPayload;
    }

    public static async authenticateAccessToken(access_token: string) {
        return this.parseAccessTokenAndGetJwtPayload(access_token) !== undefined;
    }

    public static async parseBearerTokenAndGetAuthData(bearer: string) {
        let access_token = bearer.split(' ')[1];
        if(!Validation.validateString(access_token)) {
            throw new HttpError(400, "Invalid access token");
        }
        return new AuthDataModel(bearer, await this.parseAccessTokenAndGetJwtPayload(access_token));
    }

    public static async authenticateRequest(req: Request, _res: Response, next: NextFunction) {
        let bearer = req.body.token || req.query.token || req.headers["x-access-token"] || req.headers["authorization"];
        req.body.authData = await this.parseBearerTokenAndGetAuthData(bearer);
        return next();
    }

    public static async parseBearerTokenAndGetUserId(bearer: string) {
        return (await this.parseBearerTokenAndGetAuthData(bearer)).jwtPayload.id;
    }
}
