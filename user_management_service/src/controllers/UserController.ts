import IController from "./IController";
import { Router, Request, Response } from "express";

export default class UserController implements IController {
    public router: Router;

    constructor() {
        this.router = Router();
        this.initializeRoutes();
    }

    private initializeRoutes() {
        // Get User
        this.router.get('/:userId', (req: Request, res: Response) => {
            res.send(req.body);
        });

        // Create User
        this.router.post('/', (req: Request, res: Response) => {
            res.send(req.body);
        });

        // Delete User
        this.router.delete('/:userId', (req: Request, res: Response) => {
            res.send(req.body);
        });
    }
}
