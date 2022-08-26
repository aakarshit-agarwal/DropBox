import { Router, Request, Response, NextFunction, Application } from "express";
import Authentication from "@dropbox/common_library/middlewares/Authentication";
import Logging from "@dropbox/common_library/logging/Logging";
import IController from "./IController";
import MetadataService from "../service/MetadataService";

export default class MetadataController implements IController {
    private application: Application;
    private logger: Logging;
    public metadataService: MetadataService;

    constructor(application: Application, logger: Logging, metadataService: MetadataService) {
        this.application = application;
        this.logger = logger;
        this.metadataService = metadataService;
    }

    public initializeRoutes() {
        this.logger.logInfo("Initializing Routes");
        this.application.use('/metadata', this.getRoutes());
    }

    private getRoutes() {
        let router = Router();
        // Create Metadata
        router.post('/', Authentication.authenticateRequest, 
            async (req: Request, res: Response, next: NextFunction) => {
            try {
                let metadata = await this.metadataService.createMetadata(req.body);
                res.status(201).send({id: metadata._id});
            } catch(error) {
                next(error);
            }
        });

        // Get Metadata
        router.get('/:metadataId', Authentication.authenticateRequest, 
            async (req: Request, res: Response, next: NextFunction) => {
            try {
                let metadata = await this.metadataService.getMetadata(req.params.metadataId);
                res.status(200).send(metadata);
            } catch(error) {
                next(error);
            }
        });

        // Update Metadata
        router.post('/:metadataId', Authentication.authenticateRequest, 
            async (req: Request, res: Response, next: NextFunction) => {
            try {
                let metadata = this.metadataService.updateMetadata(req.params.metadataId, req.body);
                res.status(200).send(metadata);
            } catch(error) {
                next(error);
            }
        });

        // Delete Metadata
        router.delete('/:metadataId', Authentication.authenticateRequest, 
            async (req: Request, res: Response, next: NextFunction) => {
            try {
                await this.metadataService.deleteMetadata(req.params.metadataId);
                res.status(200).send({ status: true });
            } catch(error) {
                next(error);
            }
        });
        return router;
    }
}
