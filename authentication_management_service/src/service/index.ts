import IService from './IService';
import MetadataService from './AuthenticationService';


export default class Service {
    public metadataService: IService;

    constructor() {
        this.metadataService = new MetadataService();
    }
}
