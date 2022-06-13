import { Router, Request, Response, NextFunction } from "express";
import IController from "./IController";
import Authentication from "../middlewares/Authentication";
import Service from "./../service";

export default class MetadataController implements IController {
    public router: Router;
    public service: Service;
    public authenticationMiddleware: Authentication;

    constructor() {
        this.router = Router();
        this.authenticationMiddleware = new Authentication();
        this.service = new Service();
        this.initializeRoutes();
    }

    private initializeRoutes() {
        // Create Metadata
        this.router.post('/', this.authenticationMiddleware.authenticateRequest, 
            async (req: Request, res: Response, next: NextFunction) => {
            try {
                let metadata = await this.service.metadataService.createMetadata(req.body);
                res.status(201).send({id: metadata._id});
            } catch(error) {
                next(error);
            }
        });

        // Get Metadata
        this.router.get('/:metadataId', this.authenticationMiddleware.authenticateRequest, 
            async (req: Request, res: Response, next: NextFunction) => {
            try {
                let metadata = await this.service.metadataService.getMetadata(req.params.metadataId);
                res.status(200).send(metadata);
            } catch(error) {
                next(error);
            }
        });

        // Update Metadata
        this.router.post('/:metadataId', this.authenticationMiddleware.authenticateRequest, 
            async (req: Request, res: Response, next: NextFunction) => {
            try {
                let metadata = this.service.metadataService.updateMetadata(req.params.metadataId, req.body);
                res.status(200).send(metadata);
            } catch(error) {
                next(error);
            }
        });

        // Delete Metadata
        this.router.delete('/:metadataId', this.authenticationMiddleware.authenticateRequest, 
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
