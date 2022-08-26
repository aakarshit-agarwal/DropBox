import { NextFunction, Request, Response } from "express";
import AuthDataModel from "./../models/data/AuthDataModel";
import HttpRequest from "./../utils/HttpRequest";

export default class Authentication {
    public static authenticateRequest(req: Request, _res: Response, next: NextFunction) {
        let url = `http://${process.env.AUTHENTICATION_MANAGEMENT_SERVICE_HOST}:${process.env.AUTHENTICATION_MANAGEMENT_SERVICE_PORT}/auth/`;
        HttpRequest.get(url).then(response => {
            req!.body!.authData = response.result as AuthDataModel;
            return next();
        });
    }
}
