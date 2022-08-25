import IController from "./IController";
import FileController from "./FileController";

export default class Contollers {
    private applicationContext: any;
    private fileController: IController;

    constructor(applicationContext: any) {
        this.applicationContext = applicationContext;
        this.fileController = new FileController(this.applicationContext);
    }

    public initializeControllers() {
        this.applicationContext.application.use('/files', this.fileController.router);
    }
}
