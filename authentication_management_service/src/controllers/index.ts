import { Application } from "express";
import AuthenticationController from "./AuthenticationController";
import IController from "./IController";

export default class Contollers {
    public authenticationController: IController;

    constructor() {
        this.authenticationController = new AuthenticationController();
    }

    public initializeControllers(application: Application) {
        application.use('/auth', this.authenticationController.router);
    }
}
