import MetadataManagementService from './application';

class Server {
    public application: MetadataManagementService;

    constructor() {
        this.application = new MetadataManagementService();
        this.startServer();
    }

    private startServer() {
        this.application.listen();
    }
}

export default new Server();
