import { Router, Request, Response, NextFunction } from "express";
import AuthenticationService from "./../service/AuthenticationService";
import IController from "./IController";

export default class AuthenticationController implements IController {
    public router: Router;
    public authenticationService: AuthenticationService;

    constructor() {
        this.router = Router();
        this.authenticationService = new AuthenticationService();
        this.initializeRoutes();
    }

    private initializeRoutes() {
        // Create access token
        this.router.post('/', async (req: Request, res: Response, next: NextFunction) => {
            try {
                let result = await this.authenticationService.createAccessToken(req.body);
                res.send({status: true,  id: result.id, access_token: result.access_token });
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
