import IService from './IService';
import DirectoryService from './DirectoryService';


export default class Service {
    public directoryService: IService;

    constructor(applicationContext: any) {
        this.directoryService = new DirectoryService(applicationContext);
    }
}
