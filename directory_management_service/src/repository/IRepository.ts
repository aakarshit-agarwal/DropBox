import DirectoryModel from '@dropbox/common_library/models/data/DirectoryModel';

export default interface IRepository {
    saveDirectory(directory: DirectoryModel): Promise<DirectoryModel>;
    getDirectory(id: string): Promise<DirectoryModel | null>;
    listDirectory(userId: string, parentId?: string): Promise<DirectoryModel[]>;
    deleteDirectory(id: string): Promise<DirectoryModel | null>;
}
