import express from 'express';
import cors from 'cors';
import path from 'path';
import bodyParser from 'body-parser';
import EnvReader from '@dropbox/common_library/config/EnvReader';
import ErrorHandling from '@dropbox/common_library/middlewares/ErrorHandling';
import MongoDb from '@dropbox/common_library/components/database/MongoDb';
import Kafka from '@dropbox/common_library/components/messageBroker/Kafka';
import MetadataController from './controllers/MetadataController';
import EventReceiver from './events/EventReceiver';
import EventPublisher from './events/EventPublisher';
import Logger from './logger/Logger';
import MetadataService from './service/MetadataService';
import MetadataRepository from './repository/MetadataRepository';


class MetadataManagementApplication {
    public application: express.Application;
    public port: number;
    
    constructor() {
        // Initializing Config
        let configDirectoryPath: string = path.join(__dirname, '..', '..', 'config');
        EnvReader.loadEnvFile(configDirectoryPath, process.env.NODE_ENV, true);

        // Initializing App + Logger
        this.application = express();
        this.port = process.env.METADATA_MANAGEMENT_SERVICE_PORT as unknown as number || 5000;
        let logger = new Logger(process.env.METADATA_MANAGEMENT_SERVICE_NAME);

        // Initializing Components
        let database = new MongoDb(process.env.DATABASE_HOST!, process.env.DATABASE_PORT!, 
            process.env.METADATA_MANAGEMENT_SERVICE_DATABASE_NAME!);
        database.connectDatabase();
        let messageBroker = new Kafka(process.env.KAFKA_HOST!, process.env.KAFKA_PORT! as unknown as number);

        // Initializing Middlewares
        this.initializeMiddlewares();

        // Initializing Error Handling
        this.initializeErrorHandling();

        // Event Publisher
        let eventPublisher = new EventPublisher(logger.getLogger(), messageBroker);

        // Initializing Repository
        let repository = new MetadataRepository(logger.getLogger());

        // Initializing Service
        let service = new MetadataService(logger.getLogger(), repository, eventPublisher);

        // Initializing Controller + Routes
        let controllers = new MetadataController(this.application, logger.getLogger(), service);
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
            console.log(`Metadata Management Service listening on the port ${this.port}`);
        });
    }
}

export default MetadataManagementApplication;
