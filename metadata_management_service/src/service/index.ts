import IService from './IService';
import MetadataService from './MetadataService';


export default class Service {
    public metadataService: IService;

    constructor() {
        this.metadataService = new MetadataService();
    }
}
