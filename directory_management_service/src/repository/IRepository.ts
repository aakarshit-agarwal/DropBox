import DirectoryModel from '../model/DirectoryModel';

export default interface IRepository {
    saveDirectory(directory: DirectoryModel): Promise<DirectoryModel>;
    getDirectory(id: string): Promise<DirectoryModel | null>;
    deleteDirectory(id: string): Promise<DirectoryModel | null>;
}
