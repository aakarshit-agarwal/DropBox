import IService from './IService';
import DirectoryService from './DirectoryService';


export default class Service {
    public directoryService: IService;

    constructor() {
        this.directoryService = new DirectoryService();
    }
}
