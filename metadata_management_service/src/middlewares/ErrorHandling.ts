import { Request, Response, NextFunction } from "express";
import HttpError from "../error/HttpError";

export default class ErrorHandling {
    public static handle(error: HttpError, _request: Request, response: Response, _next: NextFunction) {
        let status = error.status || 500;
        let message = error.message || 'Something went wrong';
        response.status(status).send({
            status,
            message
        });
    }
}
