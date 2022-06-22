import Route from '@dropbox/common_library/models/data/Route';
export default class Router {
    public routes: Route[];

    constructor() {   
        this.routes = [];
        this.initializeUserManagementServiceRoutes();
        this.initializeMetadataManagementServiceRoutes();
        this.initializeFileManagementServiceRoutes();
        this.initializeDirectoryManagementServiceRoutes();
    }

    initializeUserManagementServiceRoutes() {
        let userManagementRoutes: Route[] = [
            {
                url: '/users',
                proxy: {
                    target: "http://user_management_service:3001",
                    changeOrigin: false
                },
                creditCheck: false
            },
            {
                url: '/auth',
                proxy: {
                    target: "http://user_management_service:3001",
                    changeOrigin: false
                },
                creditCheck: false
            }
        ];
        this.routes = this.routes.concat(userManagementRoutes);
    }

    initializeMetadataManagementServiceRoutes() {
        let metadataManagementRoutes: Route[] = [
            {
                url: '/metadata',
                proxy: {
                    target: "http://metadata_management_service:3002",
                    changeOrigin: false
                },
                creditCheck: false
            }
        ];
        this.routes = this.routes.concat(metadataManagementRoutes);
    }

    initializeFileManagementServiceRoutes() {
        let fileManagementRoutes: Route[] = [
            {
                url: '/directory/*/files',
                proxy: {
                    target: "http://file_management_service:3003",
                    changeOrigin: true,
                    pathRewrite: {
                        [`^/directory`]: '/files',
                    }
                },
                creditCheck: false
            },
            {
                url: '/files',
                proxy: {
                    target: "http://file_management_service:3003",
                    changeOrigin: false
                },
                creditCheck: false
            }
        ];
        this.routes = this.routes.concat(fileManagementRoutes);
    }

    initializeDirectoryManagementServiceRoutes() {
        let directoryManagementRoutes: Route[] = [
            {
                url: '/directory',
                proxy: {
                    target: "http://directory_management_service:3004",
                    changeOrigin: false
                },
                creditCheck: false
            }
        ];
        this.routes = this.routes.concat(directoryManagementRoutes);
    }

    getRoutes() {
        return this.routes;
    }
}
