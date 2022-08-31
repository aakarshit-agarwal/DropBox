import BadRequestError from "../error/BadRequestError";
import { Request, Response, NextFunction } from "express";
import HttpError from "../error/HttpError";
import DatabaseError from "../error/DatabaseError";
import DependencyError from "../error/DependencyError";
import ForbiddenError from "../error/ForbiddenError";
import NotFoundError from "../error/NotFoundError";
import UnauthorizedError from "../error/UnauthorizedError";

export default class ErrorHandling {

    public static handle(error: HttpError, _request: Request, response: Response, _next: NextFunction) {
        let status = error.status;
        let message = error.message;
        if(!ErrorHandling.isCustomError(error)) {
            status = 500;
            message = 'Something went wrong!';
        }
        response.status(status).send({
            status,
            message
        });
    }

    private static isCustomError(error: HttpError) {
        return error instanceof BadRequestError
            || error instanceof DatabaseError
            || error instanceof DependencyError
            || error instanceof ForbiddenError
            || error instanceof NotFoundError
            || error instanceof UnauthorizedError;
    }
}
