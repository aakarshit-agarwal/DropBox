import { Router, Request, Response, NextFunction } from "express";
import IController from "./IController";
import Authentication from "@dropbox/common_library/middlewares/Authentication";
import Service from "./../service";
import Logging from "@dropbox/common_library/logging/Logging";

export default class MetadataController implements IController {
    private applicationContext: any;
    private logger: Logging;
    public router: Router;
    public service: Service;
    public authenticationMiddleware: Authentication;

    constructor(applicationContext: any) {
        this.applicationContext = applicationContext;
        this.logger = this.applicationContext.logger;
        this.logger;
        this.router = Router();
        this.service = new Service(this.applicationContext);
        this.initializeRoutes();
    }

    private initializeRoutes() {
        // Create Metadata
        this.router.post('/', Authentication.authenticateRequest, 
            async (req: Request, res: Response, next: NextFunction) => {
            try {
                let metadata = await this.service.metadataService.createMetadata(req.body);
                res.status(201).send({id: metadata._id});
            } catch(error) {
                next(error);
            }
        });

        // Get Metadata
        this.router.get('/:metadataId', Authentication.authenticateRequest, 
            async (req: Request, res: Response, next: NextFunction) => {
            try {
                let metadata = await this.service.metadataService.getMetadata(req.params.metadataId);
                res.status(200).send(metadata);
            } catch(error) {
                next(error);
            }
        });

        // Update Metadata
        this.router.post('/:metadataId', Authentication.authenticateRequest, 
            async (req: Request, res: Response, next: NextFunction) => {
            try {
                let metadata = this.service.metadataService.updateMetadata(req.params.metadataId, req.body);
                res.status(200).send(metadata);
            } catch(error) {
                next(error);
            }
        });

        // Delete Metadata
        this.router.delete('/:metadataId', Authentication.authenticateRequest, 
            async (req: Request, res: Response, next: NextFunction) => {
            try {
                await this.service.metadataService.deleteMetadata(req.params.metadataId);
                res.status(200).send({ status: true });
            } catch(error) {
                next(error);
            }
        });
    }
}
