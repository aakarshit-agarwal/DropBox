import express from 'express';
import cors from 'cors';
import path from 'path';
import bodyParser from 'body-parser';
import ErrorHandling from '@dropbox/common_library/middlewares/ErrorHandling';
import EnvReader from '@dropbox/common_library/config/EnvReader';
import Logger from './logger/Logger';
import RedisCache from '@dropbox/common_library/components/cache/RedisCache';
import MongoDb from '@dropbox/common_library/components/database/MongoDb';
import Kafka from '@dropbox/common_library/components/messageBroker/Kafka';
import EventReceiver from './events/EventReceiver';
// import EventPublisher from './events/EventPublisher';
import AuthenticationRepository from './repository/AuthenticationRepository';
import AuthenticationService from './service/AuthenticationService';
import AuthenticationController from './controllers/AuthenticationController';

class AuthenticationManagementApplication {
    public application: express.Application;
    public port: number;
    
    constructor() {
        // Initializing Config
        let configDirectoryPath: string = path.join(__dirname, '..', '..', 'config');
        EnvReader.loadEnvFile(configDirectoryPath, process.env.NODE_ENV, true);

        // Initializing App + Logger
        this.application = express();
        this.port = process.env.AUTHENTICATION_MANAGEMENT_SERVICE_PORT as unknown as number || 5000;
        let logger = new Logger(process.env.AUTHENTICATION_MANAGEMENT_SERVICE_NAME);

        // Initializing Components
        let database = new MongoDb(process.env.DATABASE_HOST!, process.env.DATABASE_PORT!, 
            process.env.AUTHENTICATION_MANAGEMENT_SERVICE_DATABASE_NAME!);
        database.connectDatabase();
        let redisCache = new RedisCache(process.env.AUTHENTICATION_MANAGEMENT_SERVICE_CACHE_HOST!, 
            process.env.AUTHENTICATION_MANAGEMENT_SERVICE_CACHE_PORT! as unknown as number, 
            process.env.AUTHENTICATION_MANAGEMENT_SERVICE_CACHE_PASSWORD!);
        redisCache.connectCache();
        let messageBroker = new Kafka(process.env.KAFKA_HOST!, process.env.KAFKA_PORT! as unknown as number);

        // Initializing Middlewares
        this.initializeMiddlewares();

        // Initializing Error Handling
        this.initializeErrorHandling();

        // Event Publisher
        // let eventPublisher = new EventPublisher(logger.getLogger(), messageBroker);

        // Initializing Repository
        let repository = new AuthenticationRepository(logger.getLogger());

        // Initializing Service
        let service = new AuthenticationService(logger.getLogger(), repository, redisCache);

        // Initializing Controller + Routes
        let controllers = new AuthenticationController(this.application, logger.getLogger(), service);
        controllers.initializeRoutes();

        // Initializing Event Receiver + Listeners
        let eventReceiver = new EventReceiver(logger.getLogger(), messageBroker, service);
        eventReceiver.startListening();
    }

    private initializeMiddlewares() {
        this.application.use(bodyParser.json());
        this.application.use(bodyParser.urlencoded({
            extended: false
        }));
        this.application.use(cors());
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
