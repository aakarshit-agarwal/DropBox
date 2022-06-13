import { Application } from "express";
import IController from "./IController";
import MetadataController from "./MetadataController";

export default class Contollers {
    private metadataController: IController;

    constructor() {
        this.metadataController = new MetadataController();
    }

    public initializeControllers(application: Application) {
        application.use('/metadata', this.metadataController.router);
    }
}
