import { Router, Request, Response, NextFunction } from "express";
import AuthenticationService from "./../service/AuthenticationService";
import Logging from "@dropbox/common_library/logging/Logging";
import IController from "./IController";
import Authentication from "@dropbox/common_library/middlewares/Authentication";

export default class AuthenticationController implements IController {
    public logger: Logging;
    public router: Router;
    public authenticationService: AuthenticationService;
    public authenticationMiddleware: Authentication;

    constructor(applicationContext: any) {
        this.logger = applicationContext.logger;
        this.router = Router();
        this.authenticationService = new AuthenticationService(applicationContext);
        this.authenticationMiddleware = new Authentication();
        this.initializeRoutes();
    }

    private initializeRoutes() {
        // Create access token
        this.router.post('/', async (req: Request, res: Response, next: NextFunction) => {
            try {
                let result = await this.authenticationService.createAccessToken(req.body);
                res.send({status: true,  userId: result.userId, access_token: result.access_token });
            } catch(e) {
                next(e);
            }
        });
        // Validate access token
        this.router.get('/', async (req: Request, res: Response, next: NextFunction) => {
            let bearer = req.body.token || req.query.token || req.headers["x-access-token"] || req.headers["authorization"];
            try {
                let result = await this.authenticationService.validateAccessToken(bearer);
                res.send({status: true,  userId: result });
            } catch(e) {
                next(e);
            }
        });
        // Delete access token
        this.router.delete('/', async (req: Request, res: Response, next: NextFunction) => {
            let bearer = req.body.token || req.query.token || req.headers["x-access-token"] || req.headers["authorization"];
            try {
                let result = await this.authenticationService.invalidateAccessToken(bearer);
                res.send({status: true,  deleteStatus: result });
            } catch(e) {
                next(e);
            }
        });
        // Refresh access token - yet to be implemented
    }
}
