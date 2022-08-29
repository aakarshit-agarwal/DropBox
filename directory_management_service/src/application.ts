import express from 'express';
import cors from 'cors';
import path from 'path';
import bodyParser from 'body-parser';
import EnvReader from '@dropbox/common_library/config/EnvReader';
import ErrorHandling from '@dropbox/common_library/middlewares/ErrorHandling';
import MongoDb from '@dropbox/common_library/components/database/MongoDb';
import Kafka from '@dropbox/common_library/components/messageBroker/Kafka';
import DirectoryController from './controllers/DirectoryController';
import EventReceiver from './events/EventReceiver';
import EventPublisher from './events/EventPublisher';
import Logger from './logger/Logger';
import DirectoryService from './service/DirectoryService';
import DirectoryRepository from './repository/DirectoryRepository';
import Logging from '@dropbox/common_library/logging/Logging';


class DirectoryManagementApplication {
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
        this.port = process.env.DIRECTORY_MANAGEMENT_SERVICE_PORT as unknown as number || 5000;
        this.logger = new Logger(process.env.DIRECTORY_MANAGEMENT_SERVICE_NAME).getLogger();

        // Initializing Components
        let database = new MongoDb(process.env.DATABASE_HOST!, process.env.DATABASE_PORT!, 
            process.env.DIRECTORY_MANAGEMENT_SERVICE_DATABASE_NAME!);
        database.connectDatabase();
        await this.initializeMessageBroker();

        // Initializing Middlewares
        await this.initializeMiddlewares();

        // Event Publisher
        let eventPublisher = new EventPublisher(this.logger, this.messageBroker);

        // Initializing Repository
        let repository = new DirectoryRepository(this.logger);

        // Initializing Service
        let service = new DirectoryService(this.logger, repository, eventPublisher);

        // Initializing Controller + Routes
        let controllers = new DirectoryController(this.application, this.logger, service);
        await controllers.initializeRoutes();

        // Initializing Event Receiver + Listeners
        let eventReceiver = new EventReceiver(this.logger, this.messageBroker, service);
        await eventReceiver.startListening();

        // Initializing Error Handling
        await this.initializeErrorHandling();
    }

    private async initializeMessageBroker() {
        this.messageBroker = new Kafka(this.logger, process.env.KAFKA_HOST!, process.env.KAFKA_PORT! as unknown as number,
            process.env.DIRECTORY_MANAGEMENT_SERVICE_NAME!);
        await this.messageBroker.initialize();
    }

    private async initializeMiddlewares() {
        this.application.use(bodyParser.json());
        this.application.use(bodyParser.urlencoded({
            extended: false
        }));
        this.application.use(cors());
    }

    private async initializeErrorHandling() {
        this.application.use(ErrorHandling.handle);
    }

    public listen() {
        this.application.listen(this.port, () => {
            console.log(`Directory Management Service listening on the port ${this.port}`);
        });
    }
}

export default DirectoryManagementApplication;
