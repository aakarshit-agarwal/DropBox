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
                    target: "http://user_management_service:3001/users",
                    changeOrigin: false
                },
                creditCheck: false,
                auth: false
            },
            {
                url: '/auth',
                proxy: {
                    target: "http://user_management_service:3001/auth",
                    changeOrigin: false
                },
                creditCheck: false,
                auth: false
            }
        ];
        this.routes.concat(userManagementRoutes);
    }

    initializeMetadataManagementServiceRoutes() {
        let metadataManagementRoutes: Route[] = [
            {
                url: '/metadata',
                proxy: {
                    target: "http://metadata_management_service:3002/metadata",
                    changeOrigin: false
                },
                creditCheck: false,
                auth: false
            }
        ];
        this.routes.concat(metadataManagementRoutes);
    }

    initializeFileManagementServiceRoutes() {
        let fileManagementRoutes: Route[] = [
            {
                url: '/directory/*/files',
                proxy: {
                    target: "http://file_management_service:3003/files",
                    changeOrigin: true,
                    pathRewrite: {
                        [`^/directory`]: '/files',
                    }
                },
                creditCheck: false,
                auth: false
            },
            {
                url: '/files',
                proxy: {
                    target: "http://file_management_service:3003/files",
                    changeOrigin: false
                },
                creditCheck: false,
                auth: false
            }
        ];
        this.routes.concat(fileManagementRoutes);
    }

    initializeDirectoryManagementServiceRoutes() {
        let directoryManagementRoutes: Route[] = [
            {
                url: '/directory',
                proxy: {
                    target: "http://directory_management_service:3004/directory",
                    changeOrigin: false
                },
                creditCheck: false,
                auth: false
            }
        ];
        this.routes.concat(directoryManagementRoutes);
    }

    getRoutes() {
        return this.routes;
    }
}
