import FileManagementService from './application';

class Server {
    public application: FileManagementService;

    constructor() {
        this.application = new FileManagementService();
        this.startServer();
    }

    private startServer() {
        this.application.listen();
    }
}

export default new Server();
