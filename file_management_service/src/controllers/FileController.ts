import { Router, Request, Response, NextFunction } from "express";
import IController from "./IController";
import Authentication from "@dropbox/common_library/middlewares/Authentication";
import Service from "../service";
import AddFileRequestModel from "@dropbox/common_library/models/dto/AddFileRequestModel";
import GetFileRequestModel from "@dropbox/common_library/models/dto/GetFileRequestModel";
import HttpError from "@dropbox/common_library/error/HttpError";
import { UploadedFile } from 'express-fileupload';
import Logging from "@dropbox/common_library/logging/Logging";

export default class FileController implements IController {
    private applicationContext: any;
    private logger: Logging;
    public router: Router;
    public service: Service;
    public authenticationMiddleware: Authentication;

    constructor(applicationContext: any) {
        this.applicationContext = applicationContext;
        this.logger = this.applicationContext.logger;
        this.router = Router();
        this.service = new Service(this.applicationContext);
        this.initializeRoutes();
    }

    private initializeRoutes() {
        this.logger;
        // Add File
        this.router.post('/:parentId/upload', Authentication.authenticateRequest, 
            async (req: Request, res: Response, next: NextFunction) => {
            if(req.files === undefined || Object.keys(req.files).length === 0) {
                next(new HttpError(400, "No file uploaded"));
            }
            try {
                let addFileRequests = this.getAddFileRequests(req.files!.files as UploadedFile[], req.params.parentId, req.body.authData.jwtPayload.id);
                await this.service.fileService.saveFiles(req.files!.files as UploadedFile[], req.body.authData.jwtPayload.id);
                let files = await this.service.fileService.addFiles(addFileRequests);
                res.status(201).send(files);
            } catch(error) {
                next(error);
            }
        });

        // Get File
        this.router.get('/:fileId', Authentication.authenticateRequest, 
            async (req: Request, res: Response, next: NextFunction) => {
            try {
                let getFileRequest: GetFileRequestModel = {
                    fileId: req.params.fileId
                };
                let fileResponseModel = await this.service.fileService.getFile(getFileRequest);
                res.download(fileResponseModel.filePath, fileResponseModel.fileName);
            } catch(error) {
                next(error);
            }
        });

        // Delete File
        this.router.delete('/:fileId', Authentication.authenticateRequest, 
            async (req: Request, res: Response, next: NextFunction) => {
            try {
                let file = await this.service.fileService.deleteFile(req.params.fileId);
                res.status(200).send(file);
            } catch(error) {
                next(error);
            }
        });
    }

    private getAddFileRequests(files: UploadedFile[], parentId: string, userId: string): AddFileRequestModel[] {
        let addFilesRequests: AddFileRequestModel[] = [];
        files.forEach(file => {
            console.log(file.md5);
            addFilesRequests.push({
                fileName: file.name,
                fileHash: file.md5,
                userId: userId,
                parentId: parentId
            } as AddFileRequestModel);
        });
        return addFilesRequests;
    }
}
