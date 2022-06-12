import { Router, Request, Response, NextFunction } from "express";
import IController from "./IController";
import UserService from "./../service/UserService";
import CreateUserRequest from "./../dto/CreateUserRequest";

export default class UserController implements IController {
    public router: Router;
    public service: UserService

    constructor() {
        this.router = Router();
        this.service = new UserService();
        this.initializeRoutes();
    }

    private initializeRoutes() {
        // Get User
        this.router.get('/:userId', async (req: Request, res: Response, next: NextFunction) => {
            try {
                let user = await this.service.getUser(req.params.userId);
                res.send(user);
            } catch(e) {
                next(e);
            }
        });

        // Create User
        this.router.post('/', async (req: Request, res: Response, next: NextFunction) => {
            let createUserRequest: CreateUserRequest;
            try {
                createUserRequest = new CreateUserRequest(req.body);                
                let user = await this.service.createUser(createUserRequest);
                res.send({id: user._id});
            } catch(e) {
                next(e);
            }
        });

        // Delete User
        this.router.delete('/:userId', async (req: Request, res: Response, next: NextFunction) => {
            try {
                let result = await this.service.deleteUser(req.params.userId);
                res.send(result);    
            } catch(e) {
                next(e);
            }
        });
    }
}
