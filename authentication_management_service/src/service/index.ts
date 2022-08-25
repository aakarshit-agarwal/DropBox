import IService from './IService';
import AuthenticationService from './AuthenticationService';


export default class Service {
    public authenticationService: IService;

    constructor(applicationContext: any) {
        this.authenticationService = new AuthenticationService(applicationContext);
    }
}
