import { Application } from "express";
import IController from "./IController";
import DirectoryController from "./DirectoryController";

export default class Contollers {
    private applicationContext: {
        application: Application
    };
    private directoryController: IController;

    constructor(applicationContext: any) {
        this.applicationContext = applicationContext;
        this.directoryController = new DirectoryController(this.applicationContext);
    }

    public initializeControllers() {
        this.applicationContext.application.use('/directory', this.directoryController.router);
    }
}
