import { NextFunction, Request, Response } from "express";
import { JwtPayload, verify } from "jsonwebtoken";
import HttpError from "./../error/HttpError";
import Validation from "../utils/Validation";
import AuthDataModel from "../models/data/AuthDataModel";

export default class Authentication {
    private accessTokenKey;

    constructor(access_token_key: string) {
        this.accessTokenKey = access_token_key;
    }
    public authenticateRequest(req: Request, _res: Response, next: NextFunction) {
        let bearer = req.body.token || req.query.token || req.headers["x-access-token"] || req.headers["authorization"];
        let access_token = bearer.split(' ')[1];
        if(!Validation.validateString(access_token)) {
            throw new HttpError(400, "Invalid access token");
        }
        const decode = verify(access_token, this.accessTokenKey);
        req.body.authData = new AuthDataModel(bearer, decode as JwtPayload);
        return next();
    }
}
