import { Application } from "express";
import AuthenticationController from "./AuthenticationController";
import IController from "./IController";

export default class Contollers {
    private applicationContext: {
        application: Application
    };
    public authenticationController: IController;

    constructor(applicationContext: any) {
        this.applicationContext = applicationContext;
        this.authenticationController = new AuthenticationController(this.applicationContext);
    }

    public initializeControllers(application: Application) {
        application.use('/auth', this.authenticationController.router);
    }
}
