import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import Contollers from './controllers';


class UserManagementApplication {
    public application: express.Application;
    public controllers: Contollers;
    public port: string | number;
    
    constructor(port: string | number) {
        this.application = express();
        this.controllers = new Contollers();
        this.port = port;

        this.initializeMiddlewares();
        this.initializeControllers();
    }

    private initializeMiddlewares() {
        this.application.use(bodyParser.json());
        this.application.use(bodyParser.urlencoded({
            extended: false
        }));
        this.application.use(cors());
    }

    private initializeControllers() {
        this.controllers.initializeControllers(this.application);
    }

    public listen() {
        this.application.listen(this.port, () => {
            console.log(`User Management Service listening on the port ${this.port}`);
        });
    }
}

export default UserManagementApplication;
