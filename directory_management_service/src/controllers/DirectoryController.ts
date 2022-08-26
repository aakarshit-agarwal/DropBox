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

    public initializeRoutes() {
        this.logger.logInfo("Initializing Routes");
        this.application.use('/metadata', this.getRoutes());
    }

    private getRoutes() {
        let router = Router();
        // Create Directory
        router.post('/', Authentication.authenticateRequest, 
            async (req: Request, res: Response, next: NextFunction) => {
            try {
                let directory = await this.directoryService.createDirectory(req.body, req.body.authData.jwtPayload.id);
                res.status(201).send({id: directory._id});
            } catch(error) {
                next(error);
            }
        });

        // Get Directory
        router.get('/:directoryId', Authentication.authenticateRequest, 
            async (req: Request, res: Response, next: NextFunction) => {
            try {
                let directory = await this.directoryService.getDirectory(req.params.directoryId);
                res.status(200).send(directory);
            } catch(error) {
                next(error);
            }
        });

        // List Directory
        router.get('/', Authentication.authenticateRequest, async (req, res, next) => {
            try {
                let directories = await this.directoryService.listDirectories(req.query, req.body.authData.jwtPayload.id);
                res.status(200).send(directories);
            }
            catch (error) {
                next(error);
            }
        });

        // Delete Directory
        router.delete('/:directoryId', Authentication.authenticateRequest, 
            async (req: Request, res: Response, next: NextFunction) => {
            try {
                await this.directoryService.deleteDirectory(req.params.directoryId);
                res.status(200).send({ status: true });
            } catch(error) {
                next(error);
            }
        });

        // Add Files to directory
        router.post('/:parentDirectoryId', Authentication.authenticateRequest, 
        async (req: Request, res: Response, next: NextFunction) => {
            try {
                await this.directoryService.addFilesToDirectory(req.params.parentDirectoryId, req.body);
                res.status(200).send({ status: true });
            } catch(error) {
                next(error);
            }
        });
        return router;
    }
}
