import HttpError from "./../error/HttpError";
import { NextFunction, Request, Response } from "express";
import { verify } from "jsonwebtoken";
import Validation from "./Validation";

export default class Authentication {
    public authenticateRequest(req: Request, _res: Response, next: NextFunction) {
        let access_token = req.body.token || req.query.token || req.headers["x-access-token"];
        if(!Validation.validateString(access_token)) {
            throw new HttpError(400, "Invalid access token");
        }
        const decode = verify(access_token, process.env.ACCESS_TOKEN_KET!);
        req.body.user = decode;
        return next();
    }
}
