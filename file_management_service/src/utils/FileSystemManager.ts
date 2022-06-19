import path from 'path';
import fs from 'fs';

export default class FileSystemManager {
    private uploadDirectory: string;

    constructor() {
        this.uploadDirectory = path.join(__dirname + '../' + '../' +'/upload/');
        this.createDirectoryIfNotPresent(this.uploadDirectory);
    }

    saveFile(userId: string, file: any) {
        let dirPath = path.join(this.uploadDirectory, userId);
        this.createDirectoryIfNotPresent(dirPath);
        let filePath = path.join(dirPath, file.md5);
        file.mv(filePath);
    }

    deleteFile(filePath: string) {
        fs.unlinkSync(filePath);
    }

    getFilePath(userId: string, fileHash: string) {
        return path.join(this.uploadDirectory, userId, fileHash);
    }

    private createDirectoryIfNotPresent(path: string) {
        if(!fs.existsSync(path)) {
            fs.mkdirSync(path);
        }
    }
}
