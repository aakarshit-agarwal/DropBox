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

    public authenticateRequest(req: Request, _res: Response, next: NextFunction) {
        let bearer = req.body.token || req.query.token || req.headers["x-access-token"] || req.headers["authorization"];
        let access_token = bearer.split(' ')[1];
        if(!Validation.validateString(access_token)) {
            throw new HttpError(400, "Invalid access token");
        }
        const decode = verify(access_token, process.env.ACCESS_TOKEN_KEY!);
        req.body.authData = new AuthDataModel(bearer, decode as JwtPayload);
        return next();
    }
}
