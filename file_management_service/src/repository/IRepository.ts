import FileModel from '@dropbox/common_library/models/data/FileModel';

export default interface IRepository {
    saveFiles(files: FileModel[]): Promise<FileModel[]>;
    getFile(id: string): Promise<FileModel | null>;
    listFiles(userId: string, parentId?: string, filename?: string): Promise<FileModel[]>;
    getFileByUserId(userId: string): Promise<FileModel | null>;
    deleteFile(id: string): Promise<FileModel | null>;
}
