import { Router, Request, Response, NextFunction } from "express";
import IController from "./IController";
import UserService from "./../service/UserService";
import Logging from "@dropbox/common_library/logging/Logging";
import Authentication from "@dropbox/common_library/middlewares/Authentication";

export default class UserController implements IController {
    public logger: Logging;
    public router: Router;
    public userService: UserService;
    public authenticationMiddleware: Authentication;

    constructor(applicationContext: any) {
        this.logger = applicationContext.logger;
        this.router = Router();
        this.userService = new UserService(applicationContext);
        this.authenticationMiddleware = new Authentication();
        this.initializeRoutes();
    }

    private initializeRoutes() {
        // Get User
        this.router.get('/:userId', this.authenticationMiddleware.authenticateRequest, 
            async (req: Request, res: Response, next: NextFunction) => {
            try {
                let user = await this.userService.getUser(req.params.userId, req.body.authData);
                res.status(200).send(user);
            } catch(e) {
                next(e);
            }
        });

        // Create User
        this.router.post('/', async (req: Request, res: Response, next: NextFunction) => {
            try {               
                let user = await this.userService.createUser(req.body);
                res.status(201).send({id: user._id});
            } catch(e) {
                next(e);
            }
        });

        // Delete User
        this.router.delete('/:userId', this.authenticationMiddleware.authenticateRequest, 
            async (req: Request, res: Response, next: NextFunction) => {
            try {
                let result = await this.userService.deleteUser(req.params.userId, req.body.authData);
                res.send(result);    
            } catch(e) {
                next(e);
            }
        });

        // Login User
        this.router.post('/login', async (req: Request, res: Response, next: NextFunction) => {
            await this.userService.loginUser(req.body)
            .then(result => res.send({status: true, id: result.id, access_token: result.access_token }))
            .catch(error => next(error));
        });
    }
}
