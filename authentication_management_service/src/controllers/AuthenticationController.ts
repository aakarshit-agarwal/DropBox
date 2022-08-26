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
        // Create access token
        router.post('/', async (req: Request, res: Response, next: NextFunction) => {
            try {
                let result = await this.authenticationService.createAccessToken(req.body);
                res.send({status: true,  userId: result.userId, access_token: result.access_token });
            } catch(e) {
                next(e);
            }
        });
        // Validate access token
        router.get('/', async (req: Request, res: Response, next: NextFunction) => {
            let bearer = req.body.token || req.query.token || req.headers["x-access-token"] || req.headers["authorization"];
            try {
                let result = await this.authenticationService.validateAccessToken(bearer);
                res.send({status: true,  userId: result });
            } catch(e) {
                next(e);
            }
        });
        // Delete access token
        router.delete('/', async (req: Request, res: Response, next: NextFunction) => {
            let bearer = req.body.token || req.query.token || req.headers["x-access-token"] || req.headers["authorization"];
            try {
                let result = await this.authenticationService.invalidateAccessToken(bearer);
                res.send({status: true,  deleteStatus: result });
            } catch(e) {
                next(e);
            }
        });
        // Refresh access token - yet to be implemented
        return router;
    }
}
