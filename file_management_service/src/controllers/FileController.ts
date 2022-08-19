import { Router, Request, Response, NextFunction } from "express";
import IController from "./IController";
import Authentication from "@dropbox/common_library/middlewares/Authentication";
import Service from "../service";
import AddFileRequestModel from "@dropbox/common_library/models/dto/AddFileRequestModel";
import GetFileRequestModel from "@dropbox/common_library/models/dto/GetFileRequestModel";
import HttpError from "@dropbox/common_library/error/HttpError";
import { UploadedFile } from 'express-fileupload';

export default class FileController implements IController {
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
        // Add File
        this.router.post('/:parentId/files', this.authenticationMiddleware.authenticateRequest, 
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
        this.router.get('/:fileId', this.authenticationMiddleware.authenticateRequest, 
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
        this.router.delete('/:fileId', this.authenticationMiddleware.authenticateRequest, 
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
        console.log(files);
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
