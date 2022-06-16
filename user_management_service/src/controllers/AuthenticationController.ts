import { Router, Request, Response, NextFunction } from "express";
import IController from "./IController";
import Authentication from '@dropbox/common_library/middlewares/Authentication';

export default class AuthenticationController implements IController {
    public router: Router;
    public authenticationMiddleware: Authentication;

    constructor() {
        this.router = Router();
        this.authenticationMiddleware = new Authentication();
        this.initializeRoutes();
    }

    private initializeRoutes() {
         // Login User
        this.router.get('/', this.authenticationMiddleware.authenticateRequest, 
            async (_req: Request, res: Response, _next: NextFunction) => {
            res.status(200);
        });
    }
}
