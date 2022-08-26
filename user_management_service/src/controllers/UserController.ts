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
        // Logout User
        router.get('/logout', Authentication.authenticateRequest,
            async (req: Request, res: Response, next: NextFunction) => {
            await this.userService.logoutUser(req.body.authData)
            .then(result => res.send({status: true, result: result }))
            .catch(error => next(error));
        });

        // Get User
        router.get('/:userId', Authentication.authenticateRequest, 
            async (req: Request, res: Response, next: NextFunction) => {
            await this.userService.getUser(req.params.userId, req.body.authData)
            .then(result => res.status(200).send(result))
            .catch(error => next(error));
        });

        // Create User
        router.post('/', async (req: Request, res: Response, next: NextFunction) => {
            await this.userService.createUser(req.body)
            .then(result => res.status(201).send({id: result.userId}))
            .catch(error => next(error));
        });

        // Delete User
        router.delete('/:userId', Authentication.authenticateRequest, 
            async (req: Request, res: Response, next: NextFunction) => {
            await this.userService.deleteUser(req.params.userId, req.body.authData)
            .then(() => res.status(204).send())
            .catch(error => next(error));
        });

        // Login User
        router.post('/login', async (req: Request, res: Response, next: NextFunction) => {
            await this.userService.loginUser(req.body)
            .then(result => res.send({status: true, result: result }))
            .catch(error => next(error));
        });
        return router;
    }
}
