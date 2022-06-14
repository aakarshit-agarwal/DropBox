import { NextFunction, Request, Response } from "express";
import { verify } from "jsonwebtoken";
import HttpError from "./../error/HttpError";
import Validation from "../utils/Validation";

export default class Authentication {
    public authenticateRequest(req: Request, _res: Response, next: NextFunction) {
        let bearer = req.body.token || req.query.token || req.headers["x-access-token"] || req.headers["authorization"];
        let bearer_token = bearer.split(' ')[1];
        if(!Validation.validateString(bearer_token)) {
            throw new HttpError(400, "Invalid access token");
        }
        const decode = verify(bearer_token, process.env.ACCESS_TOKEN_KET!);
        req.body.authData = decode;
        return next();
    }
}
