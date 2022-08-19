import ApiGatway from './application';

class Server {
    public application: ApiGatway;

    constructor() {
        this.application = new ApiGatway();
        this.startServer();
    }

    private startServer() {
        this.application.listen();
    }
}

export default new Server();
