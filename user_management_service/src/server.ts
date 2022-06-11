import UserManagementApplication from './application';

class Server {
    public application: UserManagementApplication;

    constructor() {
        this.application = new UserManagementApplication(5000);
        this.startServer();
    }

    private startServer() {
        this.application.listen();
    }
}

export default new Server();
