import DirectoryManagementService from './application';

class Server {
    public application: DirectoryManagementService;

    constructor() {
        this.application = new DirectoryManagementService();
        this.startServer();
    }

    private startServer() {
        this.application.listen();
    }
}

export default new Server();
