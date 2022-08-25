import IService from './IService';
import FileService from './FileService';


export default class Service {
    private applicationContext: any;
    public fileService: IService;

    constructor(applicationContext: any) {
        this.applicationContext = applicationContext;
        this.fileService = new FileService(this.applicationContext);
    }
}
