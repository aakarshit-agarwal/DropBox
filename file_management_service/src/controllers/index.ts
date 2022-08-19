import { Application } from "express";
import IController from "./IController";
import FileController from "./FileController";

export default class Contollers {
    private fileController: IController;

    constructor() {
        this.fileController = new FileController();
    }

    public initializeControllers(application: Application) {
        application.use('/files', this.fileController.router);
    }
}
