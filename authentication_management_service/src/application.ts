import express from 'express';
import cors from 'cors';
import path from 'path';
import bodyParser from 'body-parser';
import Contollers from './controllers';
import ErrorHandling from '@dropbox/common_library/middlewares/ErrorHandling';
import EventReceiver from './events/EventReceiver';
import EnvReader from '@dropbox/common_library/config/EnvReader';
import Logger from './logger/Logger';
import RedisCache from '@dropbox/common_library/components/cache/RedisCache';
import MongoDb from '@dropbox/common_library/components/database/MongoDb';


class AuthenticationManagementApplication {
    public envReader: EnvReader;
    public logger: Logger;
    public database: MongoDb;
    public redisCache: RedisCache;
    public application: express.Application;
    public port: string | number;
    public controllers: Contollers;
    public eventReceiver: EventReceiver;
    
    constructor() {
        let configDirectoryPath: string = path.join(__dirname, '..', '..', 'config');
        this.envReader = new EnvReader(configDirectoryPath, process.env.NODE_ENV, true);
        this.logger = new Logger(process.env.AUTHENTICATION_MANAGEMENT_SERVICE_NAME);
        this.database = new MongoDb(process.env.DATABASE_HOST!, process.env.DATABASE_PORT!, 
            process.env.USER_MANAGEMENT_SERVICE_DATABASE_NAME!);
        this.redisCache = new RedisCache(process.env.AUTHENTICATION_MANAGEMENT_SERVICE_CACHE_HOST!, 
            process.env.AUTHENTICATION_MANAGEMENT_SERVICE_CACHE_PORT! as unknown as number, 
            process.env.AUTHENTICATION_MANAGEMENT_SERVICE_CACHE_PASSWORD!);
        this.application = express();
        this.port = process.env.AUTHENTICATION_MANAGEMENT_SERVICE_PORT || 5000;
        let applicationContext = {
            application: this.application,
            cache: this.redisCache,
            database: this.database,
            logger: this.logger.getLogger()
        };
        this.controllers = new Contollers(applicationContext);
        this.eventReceiver = new EventReceiver(applicationContext);

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
            console.log(`Authentication Management Service listening on the port ${this.port}`);
        });
    }
}

export default AuthenticationManagementApplication;
