import UserManagementApplication from './application';

class Server {
    public application: UserManagementApplication;

    constructor() {
        this.application = new UserManagementApplication();
        this.startServer();
    }

    private startServer() {
        this.application.listen();
    }
}

export default new Server();
