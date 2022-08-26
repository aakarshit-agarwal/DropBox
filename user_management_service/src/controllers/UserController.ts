import { Router, Request, Response, NextFunction, Application } from "express";
import IController from "./IController";
import UserService from "./../service/UserService";
import Logging from "@dropbox/common_library/logging/Logging";
import Authentication from "@dropbox/common_library/middlewares/Authentication";

export default class UserController implements IController {
    private application: Application;
    private logger: Logging;
    public userService: UserService;

    constructor(application: Application, logger: Logging, userService: UserService) {
        this.application = application;
        this.logger = logger;
        this.userService = userService;
    }

    public initializeRoutes() {
        this.logger.logInfo("Initializing Routes");
        this.application.use('/users', this.getRoutes());
    }

    private getRoutes() {
        let router = Router();
        // Get User
        router.get('/:userId', Authentication.authenticateRequest, 
            async (req: Request, res: Response, next: NextFunction) => {
            try {
                let user = await this.userService.getUser(req.params.userId, req.body.authData);
                res.status(200).send(user);
            } catch(e) {
                next(e);
            }
        });

        // Create User
        router.post('/', async (req: Request, res: Response, next: NextFunction) => {
            try {               
                let user = await this.userService.createUser(req.body);
                res.status(201).send({id: user._id});
            } catch(e) {
                next(e);
            }
        });

        // Delete User
        router.delete('/:userId', Authentication.authenticateRequest, 
            async (req: Request, res: Response, next: NextFunction) => {
            try {
                let result = await this.userService.deleteUser(req.params.userId, req.body.authData);
                res.send(result);    
            } catch(e) {
                next(e);
            }
        });

        // Login User
        router.post('/login', async (req: Request, res: Response, next: NextFunction) => {
            await this.userService.loginUser(req.body)
            .then(result => res.send({status: true, id: result.id, access_token: result.access_token }))
            .catch(error => next(error));
        });
        return router;
    }
}
