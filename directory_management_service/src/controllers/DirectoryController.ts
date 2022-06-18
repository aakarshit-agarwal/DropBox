import { Router, Request, Response, NextFunction } from "express";
import IController from "./IController";
import Authentication from "@dropbox/common_library/middlewares/Authentication";
import Service from "../service";

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
        // Create Directory
        this.router.post('/', this.authenticationMiddleware.authenticateRequest, 
            async (req: Request, res: Response, next: NextFunction) => {
            try {
                let directory = await this.service.directoryService.createDirectory(req.body, req.body.authData.jwtPayload.id);
                res.status(201).send({id: directory._id});
            } catch(error) {
                next(error);
            }
        });

        // Get Directory
        this.router.get('/:directoryId', this.authenticationMiddleware.authenticateRequest, 
            async (req: Request, res: Response, next: NextFunction) => {
            try {
                let directory = await this.service.directoryService.getDirectory(req.params.directoryId);
                res.status(200).send(directory);
            } catch(error) {
                next(error);
            }
        });

        // List Directory
        this.router.get('/', this.authenticationMiddleware.authenticateRequest, async (req, res, next) => {
            try {
                let directories = await this.service.directoryService.listDirectories(req.query, req.body.authData.jwtPayload.id);
                res.status(200).send(directories);
            }
            catch (error) {
                next(error);
            }
        });

        // Delete Directory
        this.router.delete('/:directoryId', this.authenticationMiddleware.authenticateRequest, 
            async (req: Request, res: Response, next: NextFunction) => {
            try {
                await this.service.directoryService.deleteDirectory(req.params.directoryId);
                res.status(200).send({ status: true });
            } catch(error) {
                next(error);
            }
        });

        // Add Files to directory
        this.router.post('/:parentDirectoryId', this.authenticationMiddleware.authenticateRequest, 
        async (req: Request, res: Response, next: NextFunction) => {
            try {
                await this.service.directoryService.addFilesToDirectory(req.params.parentDirectoryId, req.body);
                res.status(200).send({ status: true });
            } catch(error) {
                next(error);
            }
        });
    }
}
