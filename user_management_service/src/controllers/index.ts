import { Application } from "express";
import IController from "./IController";
import UserController from "./UserController";

export default class Contollers {
    private applicationContext: {
        application: Application
    };
    public userController: IController;

    constructor(applicationContext: any) {
        this.applicationContext = applicationContext;
        this.userController = new UserController(this.applicationContext);
    }

    public initializeControllers() {
        this.applicationContext.application.use('/users', this.userController.router);
    }
}
