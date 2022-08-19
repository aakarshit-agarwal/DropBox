import AuthenticationManagementApplication from './application';

class Server {
    public application: AuthenticationManagementApplication;

    constructor() {
        this.application = new AuthenticationManagementApplication();
        this.startServer();
    }

    private startServer() {
        this.application.listen();
    }
}

export default new Server();
