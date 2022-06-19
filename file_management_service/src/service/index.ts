import IService from './IService';
import FileService from './FileService';


export default class Service {
    public fileService: IService;

    constructor() {
        this.fileService = new FileService();
    }
}
