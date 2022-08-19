import { Application } from "express";
import IController from "./IController";
import DirectoryController from "./DirectoryController";

export default class Contollers {
    private directoryController: IController;

    constructor() {
        this.directoryController = new DirectoryController();
    }

    public initializeControllers(application: Application) {
        application.use('/directory', this.directoryController.router);
    }
}
