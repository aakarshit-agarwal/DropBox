import express from 'express';
import cors from 'cors';
import path from 'path';
import bodyParser from 'body-parser';
import EnvReader from '@dropbox/common_library/config/EnvReader';
import Contollers from './controllers';
import ErrorHandling from '@dropbox/common_library/middlewares/ErrorHandling';
import EventReceiver from './events/EventReceiver';
import MongoDb from '@dropbox/common_library/components/database/MongoDb';
import Logger from './logger/Logger';


class UserManagementApplication {
    public envReader: EnvReader;
    public logger: Logger;
    public application: express.Application;
    public port: string | number;
    public controllers: Contollers;
    public database: MongoDb;
    public eventReceiver: EventReceiver;
    
    constructor() {
        let configDirectoryPath: string = path.join(__dirname, '..', '..', 'config');
        this.envReader = new EnvReader(configDirectoryPath, process.env.NODE_ENV, true);
        this.logger = new Logger(process.env.USER_MANAGEMENT_SERVICE_NAME);
        this.database = new MongoDb(process.env.DATABASE_HOST, process.env.DATABASE_PORT, 
            process.env.USER_MANAGEMENT_SERVICE_DATABASE_NAME);
        this.application = express();
        this.port = process.env.USER_MANAGEMENT_SERVICE_PORT || 5000;
        let applicationContext = {
            application: this.application,
            database: this.database,
            logger: this.logger.getLogger()
        };
        this.controllers = new Contollers(applicationContext);
        this.eventReceiver = new EventReceiver();

        this.initializeMiddlewares();
        this.initializeControllers();
        this.initializeEventReceiver();
        this.initializeErrorHandling();
    }

    private initializeMiddlewares() {
        this.application.use(bodyParser.json());
        this.application.use(bodyParser.urlencoded({
            extended: false
        }));
        this.application.use(cors());
    }

    private initializeControllers() {
        this.controllers.initializeControllers();
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
