import { Router, Request, Response, NextFunction, Application } from "express";
import Logging from "@dropbox/common_library/logging/Logging";
import Authentication from "@dropbox/common_library/middlewares/Authentication";
import DirectoryService from "../service/DirectoryService";
import IController from "./IController";

export default class DirectoryController implements IController {
    private application: Application;
    private logger: Logging;
    public directoryService: DirectoryService;

    constructor(application: Application, logger: Logging, directoryService: DirectoryService) {
        this.application = application;
        this.logger = logger;
        this.directoryService = directoryService;
    }

    public async initializeRoutes() {
        this.logger.logInfo("Initializing Routes");
        this.application.use('/directory', await this.getRoutes());
    }

    private async getRoutes() {
        let router = Router();
        // Create Directory
        router.post('/', Authentication.authenticateRequest, async (req: Request, res: Response, next: NextFunction) => {
            this.directoryService.createDirectory(req.body, req.body.authData)
            .then(result => res.status(201).send({ status: true, result: result }))
            .catch(error => next(error));
        });

        // Get Directory
        router.get('/:directoryId', Authentication.authenticateRequest, async (req: Request, res: Response, next: NextFunction) => {
            this.directoryService.getDirectory(req.params.directoryId, req.body.authData)
            .then(result => res.status(200).send({ status: true, result: result }))
            .catch(error => next(error));
        });

        // List Directory
        router.get('/', Authentication.authenticateRequest, async (req: Request, res: Response, next: NextFunction) => {
            this.directoryService.listDirectories(req.query, req.body.authData)
            .then(result => res.status(200).send({ status: true, result: result }))
            .catch(error => next(error));
        });

        // Delete Directory
        router.delete('/:directoryId', Authentication.authenticateRequest, async (req: Request, res: Response, next: NextFunction) => {
            this.directoryService.deleteDirectory(req.params.directoryId, req.body.authData)
            .then(result => res.status(200).send({ status: true, result: result }))
            .catch(error => next(error));
        });

        // Add Files to directory
        router.post('/:parentDirectoryId', Authentication.authenticateRequest, async (req: Request, res: Response, next: NextFunction) => {
            this.directoryService.addFilesToDirectory(req.params.parentDirectoryId, req.body.files, req.body.authData)
            .then(result => res.status(200).send({ status: true, result: result }))
            .catch(error => next(error));
        });
        return router;
    }
}
