import IController from "./IController";
import MetadataController from "./MetadataController";

export default class Contollers {
    private applicationContext: any;
    private metadataController: IController;

    constructor(applicationContext: any) {
        this.applicationContext = applicationContext;
        this.metadataController = new MetadataController(this.applicationContext);
    }

    public initializeControllers() {
        this.applicationContext.application.use('/metadata', this.metadataController.router);
    }
}
