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
import AuthenticationRepository from './repository/AuthenticationRepository';
import AuthenticationService from './service/AuthenticationService';
import AuthenticationController from './controllers/AuthenticationController';
import Logging from '@dropbox/common_library/logging/Logging';
import EventPublisher from './events/EventPublisher';

class AuthenticationManagementApplication {
    private application: express.Application;
    private port: number;
    private messageBroker: Kafka;
    private logger: Logging;
        
    constructor() {
        this.initializeAplication();
    }

    async initializeAplication() {
        // Initializing Config
        let configDirectoryPath: string = path.join(__dirname, '..', '..', 'config');
        EnvReader.loadEnvFile(configDirectoryPath, process.env.NODE_ENV, true);

        // Initializing App + Logger
        this.application = express();
        this.port = process.env.AUTHENTICATION_MANAGEMENT_SERVICE_PORT as unknown as number || 5000;
        this.logger = new Logger(process.env.AUTHENTICATION_MANAGEMENT_SERVICE_NAME).getLogger();

        // Initializing Components
        let database = new MongoDb(process.env.DATABASE_HOST!, process.env.DATABASE_PORT!, 
            process.env.AUTHENTICATION_MANAGEMENT_SERVICE_DATABASE_NAME!);
        database.connectDatabase();
        let redisCache = new RedisCache(process.env.AUTHENTICATION_MANAGEMENT_SERVICE_CACHE_HOST!, 
            process.env.AUTHENTICATION_MANAGEMENT_SERVICE_CACHE_PORT! as unknown as number, 
            process.env.AUTHENTICATION_MANAGEMENT_SERVICE_CACHE_PASSWORD!);
        redisCache.connectCache();
        await this.initializeMessageBroker();

        // Initializing Middlewares
        this.initializeMiddlewares();

        // Event Publisher
        let eventPublisher = new EventPublisher(this.logger, this.messageBroker);

        // Initializing Repository
        let repository = new AuthenticationRepository(this.logger);

        // Initializing Service
        let service = new AuthenticationService(this.logger, repository, redisCache, eventPublisher);

        // Initializing Controller + Routes
        let controllers = new AuthenticationController(this.application, this.logger, service);
        controllers.initializeRoutes();

        // Initializing Event Receiver + Listeners
        let eventReceiver = new EventReceiver(this.logger, this.messageBroker, service);
        await eventReceiver.startListening();

        // Initializing Error Handling
        this.initializeErrorHandling();
    }

    private async initializeMessageBroker() {
        this.messageBroker = new Kafka(this.logger, process.env.KAFKA_HOST!, process.env.KAFKA_PORT! as unknown as number, 
            process.env.AUTHENTICATION_MANAGEMENT_SERVICE_NAME!);
        await this.messageBroker.initialize();
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
