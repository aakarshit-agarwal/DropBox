import { Application } from "express";
import AuthenticationController from "./AuthenticationController";
import IController from "./IController";
import UserController from "./UserController";

export default class Contollers {
    public userController: IController;
    public authenticationController: IController;

    constructor() {
        this.userController = new UserController();
        this.authenticationController = new AuthenticationController();
    }

    public initializeControllers(application: Application) {
        application.use('/', this.authenticationController.router);
        application.use('/', this.userController.router);
    }
}
