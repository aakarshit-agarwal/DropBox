import { Router, Request, Response, NextFunction, Application } from "express";
import IController from "./IController";
import Authentication from "@dropbox/common_library/middlewares/Authentication";
import AddFileRequestModel from "@dropbox/common_library/models/dto/AddFileRequestModel";
import GetFileRequestModel from "@dropbox/common_library/models/dto/GetFileRequestModel";
import HttpError from "@dropbox/common_library/error/HttpError";
import Logging from "@dropbox/common_library/logging/Logging";
import { UploadedFile } from 'express-fileupload';
import FileService from "./../service/FileService";

export default class FileController implements IController {
    private application: Application;
    private logger: Logging;
    public fileService: FileService;

    constructor(application: Application, logger: Logging, fileService: FileService) {
        this.application = application;
        this.logger = logger;
        this.fileService = fileService;
    }

    public initializeRoutes() {
        this.logger.logInfo("Initializing Routes");
        this.application.use('/file', this.getRoutes());
    }

    private getRoutes() {
        let router = Router();
        // Add File
        router.post('/:parentId/upload', Authentication.authenticateRequest, 
            async (req: Request, res: Response, next: NextFunction) => {
            if(req.files === undefined || Object.keys(req.files).length === 0) {
                next(new HttpError(400, "No file uploaded"));
            }
            try {
                let addFileRequests = this.getAddFileRequests(req.files!.files as UploadedFile[], req.params.parentId, req.body.authData.jwtPayload.id);
                await this.fileService.saveFiles(req.files!.files as UploadedFile[], req.body.authData.jwtPayload.id);
                let files = await this.fileService.addFiles(addFileRequests);
                res.status(201).send(files);
            } catch(error) {
                next(error);
            }
        });

        // Get File
        router.get('/:fileId', Authentication.authenticateRequest, 
            async (req: Request, res: Response, next: NextFunction) => {
            try {
                let getFileRequest: GetFileRequestModel = {
                    fileId: req.params.fileId
                };
                let fileResponseModel = await this.fileService.getFile(getFileRequest);
                res.download(fileResponseModel.filePath, fileResponseModel.fileName);
            } catch(error) {
                next(error);
            }
        });

        // Delete File
        router.delete('/:fileId', Authentication.authenticateRequest, 
            async (req: Request, res: Response, next: NextFunction) => {
            try {
                let file = await this.fileService.deleteFile(req.params.fileId);
                res.status(200).send(file);
            } catch(error) {
                next(error);
            }
        });
        return router;
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
