import path from 'path';
import fs from 'fs';
import Logging from '@dropbox/common_library/logging/Logging';

export default class FileSystemManager {
    private applicationContext: any;
    private logger: Logging;
    private uploadDirectory: string;

    constructor(applicationContext: any) {
        this.applicationContext = applicationContext;
        this.logger = this.applicationContext.logger;
        this.logger;
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
            fs.mkdirSync(path);
        }
    }
}
