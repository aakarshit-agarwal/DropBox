import UserManagementApplication from './application';
import Common from '@dropbox/common_library';

class Server {
    public application: UserManagementApplication;

    constructor() {
        console.log(new Common());
        this.application = new UserManagementApplication();
        //this.startServer();
    }

    // private startServer() {
    //     this.application.listen();
    // }
}

export default new Server();
