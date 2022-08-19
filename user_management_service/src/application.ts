import express from 'express';
import cors from 'cors';
import path from 'path';
import bodyParser from 'body-parser';
import Contollers from './controllers';
import Config from '@dropbox/common_library/config';
import ErrorHandling from '@dropbox/common_library/middlewares/ErrorHandling';
import EventReceiver from './events/EventReceiver';


class UserManagementApplication {
    public application: express.Application;
    public config: Config; 
    public controllers: Contollers;
    public port: string | number;
    public eventReceiver: EventReceiver;
    
    constructor() {
        this.application = express();
        this.config = new Config(path.join(__dirname, 'resources/'));
        this.controllers = new Contollers();
        this.port = process.env.PORT || 5000;
        this.eventReceiver = new EventReceiver();

        this.initializeMiddlewares();
        this.initializeControllers();
        this.initializeEventReceiver();
        this.initializeErrorHandling();
    }

    private initializeControllers() {
        this.controllers.initializeControllers(this.application);
    }

    private initializeMiddlewares() {
        this.application.use(bodyParser.json());
        this.application.use(bodyParser.urlencoded({
            extended: false
        }));
        this.application.use(cors());
    }

    private initializeEventReceiver() {
        this.eventReceiver.startListening();
    }

    private initializeErrorHandling() {
        this.application.use(ErrorHandling.handle);
    }

    public listen() {
        this.application.listen(this.port, () => {
            console.log(`User Management Service listening on the port ${this.port}`);
        });
    }
}

export default UserManagementApplication;
