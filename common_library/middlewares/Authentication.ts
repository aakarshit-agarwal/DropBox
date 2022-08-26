import { NextFunction, Request, Response } from "express";
import AuthDataModel from "./../models/data/AuthDataModel";
import HttpRequest from "./../utils/HttpRequest";

export default class Authentication {
    public static async authenticateRequest(req: Request, _res: Response, next: NextFunction) {
        let bearer = req.body.token || req.query.token || req.headers["x-access-token"] || req.headers["authorization"];
        let url = `http://${process.env.AUTHENTICATION_MANAGEMENT_SERVICE_HOST}:${process.env.AUTHENTICATION_MANAGEMENT_SERVICE_PORT}/auth/`;
        try {
            let response = await HttpRequest.get(url, {authorization: bearer});
            req.body.authData = response.data.result as AuthDataModel;
            return next();
        } catch(error: any) {
            return next(error);
        }
    }
}
