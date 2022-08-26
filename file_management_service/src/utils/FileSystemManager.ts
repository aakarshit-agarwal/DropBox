import path from 'path';
import fs from 'fs';
import Logging from '@dropbox/common_library/logging/Logging';

export default class FileSystemManager {
    private logger: Logging;
    private uploadDirectory: string;

    constructor(logger: Logging) {
        this.logger = logger;
        this.uploadDirectory = path.join(__dirname, '..', '..', '/upload/');
        this.createDirectoryIfNotPresent(this.uploadDirectory);
    }

    async saveFile(userId: string, file: any) {
        let dirPath = path.join(this.uploadDirectory, userId);
        await this.createDirectoryIfNotPresent(dirPath);
        let filePath = path.join(dirPath, file.md5);
        await file.mv(filePath);
    }

    deleteFile(filePath: string) {
        fs.unlinkSync(filePath);
    }

    getFilePath(userId: string, fileHash: string) {
        return path.join(this.uploadDirectory, userId, fileHash);
    }

    private async createDirectoryIfNotPresent(path: string) {
        if(!fs.existsSync(path)) {
            this.logger.logInfo("Creating upload directory");
            fs.mkdirSync(path);
        }
    }
}
