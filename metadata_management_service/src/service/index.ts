import IService from './IService';
import MetadataService from './MetadataService';


export default class Service {
    private applicationContext: any;
    public metadataService: IService;

    constructor(applicationContext: any) {
        this.applicationContext = applicationContext;
        this.metadataService = new MetadataService(this.applicationContext);
    }
}
