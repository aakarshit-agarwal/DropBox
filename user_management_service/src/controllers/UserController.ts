// Package Imports
import "reflect-metadata";
import {inject, injectable} from "inversify";
import { Router, Request, Response, NextFunction, Application } from "express";

// Common Library Imports
import Authentication from "@dropbox/common_library/middlewares/Authentication";
import Logging from "@dropbox/common_library/logging/Logging";
import NotImplementedError from "@dropbox/common_library/error/NotImplementedError";

// Local Imports
import DependencyTypes from '../DependencyTypes';
import IController from "./IController";
import UserService from "./../service/UserService";


@injectable()
export default class UserController implements IController {
    private application: Application;
    private logger: Logging;
    public userService: UserService;

    constructor(
        @inject(DependencyTypes.Application) application: Application, 
        @inject(DependencyTypes.Logger) logger: Logging, 
        @inject(DependencyTypes.UserService) userService: UserService
    ) {
        this.application = application;
        this.logger = logger;
        this.userService = userService;
        this.logger.logInfo("Initializing controller");
    }

    public initializeRoutes() {
        this.logger.logInfo("Initializing routes");
        this.application.use('/users', this.getRoutes());
    }

    private getRoutes() {
        let router = Router();
        // Logout User
        router.get('/logout', Authentication.authenticateRequest,
            async (req: Request, res: Response, next: NextFunction) => {
            await this.userService.logoutUser(req.body.authData)
            .then(result => res.send({status: true, result: result }))
            .catch(error => {
                this.logger.logError("Error ocurred: ", {error: error});
                next(error)
            });
        });

        // Get User
        router.get('/:userId', Authentication.authenticateRequest, 
            async (req: Request, res: Response, next: NextFunction) => {
            await this.userService.getUser(req.params.userId, req.body.authData)
            .then(result => res.status(200).send(result))
            .catch(error => {
                this.logger.logError("Error ocurred: ", {error: error});
                next(error)
            });
        });

        // Create User
        router.post('/', async (req: Request, res: Response, next: NextFunction) => {
            await this.userService.createUser(req.body)
            .then(result => res.status(201).send({id: result.userId}))
            .catch(error => {
                this.logger.logError("Error ocurred: ", {error: error});
                next(error)
            });
        });

        // Update User
        router.post('/:userId', async (req: Request, res: Response, next: NextFunction) => {
            next(new NotImplementedError());
        });

        // Delete User
        router.delete('/:userId', Authentication.authenticateRequest, 
            async (req: Request, res: Response, next: NextFunction) => {
            await this.userService.deleteUser(req.params.userId, req.body.authData)
            .then(() => res.status(204).send())
            .catch(error => {
                this.logger.logError("Error ocurred: ", {error: error});
                next(error)
            });
        });

        // Login User
        router.post('/login', async (req: Request, res: Response, next: NextFunction) => {
            await this.userService.loginUser(req.body)
            .then(result => res.send({status: true, result: result }))
            .catch(error => {
                this.logger.logError("Error ocurred: ", {error: error});
                next(error)
            });
        });
        return router;
    }
}
