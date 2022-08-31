// Package Imports
import "reflect-metadata";
import { Request, Response, NextFunction } from "express";
import { inject, injectable } from "inversify";

// Common Library Imports

// Local Imports
import BadRequestError from "../error/BadRequestError";
import HttpError from "../error/HttpError";
import DatabaseError from "../error/DatabaseError";
import DependencyError from "../error/DependencyError";
import ForbiddenError from "../error/ForbiddenError";
import NotFoundError from "../error/NotFoundError";
import NotImplementedError from "../error/NotImplementedError";
import UnauthorizedError from "../error/UnauthorizedError";
import Logging from "../logging/Logging";
import DependencyTypes from "../GlobalTypes";

@injectable()
export default class ErrorHandling {
    private static logger: Logging;
    constructor(
        @inject(DependencyTypes.Logger) logger: Logging,
    ) {
        Logging.logger = logger;
    }

    public static handle(error: HttpError, _request: Request, response: Response, _next: NextFunction) {
        // this.logger.logError("Error ocurred", error);
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
            || error instanceof NotImplementedError
            || error instanceof UnauthorizedError;
    }
}
