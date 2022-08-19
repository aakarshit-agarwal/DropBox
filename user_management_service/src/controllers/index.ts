import { Application } from "express";
import IController from "./IController";
import UserController from "./UserController";

export default class Contollers {
    public userController: IController;

    constructor() {
        this.userController = new UserController();
    }

    public initializeControllers(application: Application) {
        application.use('/users', this.userController.router);
    }
}
