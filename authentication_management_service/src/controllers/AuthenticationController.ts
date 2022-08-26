import { Router, Request, Response, NextFunction, Application } from "express";
import AuthenticationService from "./../service/AuthenticationService";
import Logging from "@dropbox/common_library/logging/Logging";
import IController from "./IController";

export default class AuthenticationController implements IController {
    private application: Application;
    private logger: Logging;
    private authenticationService: AuthenticationService;

    constructor(application: Application, logger: Logging, authenticationService: AuthenticationService) {
        this.application = application;
        this.logger = logger;
        this.authenticationService = authenticationService;
    }

    public initializeRoutes() {
        this.logger.logInfo("Initializing Routes");
        this.application.use('/auth', this.getRoutes());
    }

    private getRoutes() {
        let router = Router();
        // Create access token - Internal API
        router.post('/', async (req: Request, res: Response, next: NextFunction) => {
            await this.authenticationService.createAccessToken(req.body)
            .then(result => res.send({status: true,  result: result }))
            .catch(error => next(error));
        });

        // Validate access token
        router.get('/', async (req: Request, res: Response, next: NextFunction) => {
            let bearer = req.body.token || req.query.token || req.headers["x-access-token"] || req.headers["authorization"];
            let access_token = bearer.split(' ')[1];
            await this.authenticationService.validateAccessToken(access_token)
            .then(result => res.send({status: true, result: result}))
            .catch(error => next(error));
        });

        // Delete access token
        router.delete('/', async (req: Request, res: Response, next: NextFunction) => {
            let bearer = req.body.token || req.query.token || req.headers["x-access-token"] || req.headers["authorization"];
            let access_token = bearer.split(' ')[1];
            await this.authenticationService.invalidateAccessToken(access_token)
            .then(result => res.send({status: true, deleteStatus: result}))
            .catch(error => next(error));
        });
        // Refresh access token - yet to be implemented
        return router;
    }
}
