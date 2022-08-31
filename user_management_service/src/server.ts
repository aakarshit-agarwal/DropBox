// Package Imports
import "reflect-metadata";

// Common Library Imports
import '@dropbox/common_library/config/EnvReader';

// Local Imports
import container from './DependencyBindings';
import UserManagementApplication from './application';
import DependencyTypes from './DependencyTypes';

class Server {
    public application: UserManagementApplication;

    constructor() {
        this.application = container.get<UserManagementApplication>(DependencyTypes.UserManagementService);
        this.startServer();
    }

    private startServer() {
        this.application.listen();
    }
}

export default new Server();
