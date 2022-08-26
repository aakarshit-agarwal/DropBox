import express from 'express';
import cors from 'cors';
import path from 'path';
import bodyParser from 'body-parser';
import EnvReader from '@dropbox/common_library/config/EnvReader';
import ErrorHandling from '@dropbox/common_library/middlewares/ErrorHandling';
import MongoDb from '@dropbox/common_library/components/database/MongoDb';
import Kafka from '@dropbox/common_library/components/messageBroker/Kafka';
import FileController from './controllers/FileController';
import EventReceiver from './events/EventReceiver';
import EventPublisher from './events/EventPublisher';
import Logger from './logger/Logger';
import FileService from './service/FileService';
import FileRepository from './repository/FileRepository';
import FileSystemManager from './utils/FileSystemManager';


class FileManagementApplication {
    public application: express.Application;
    public port: number;
    
    constructor() {
        // Initializing Config
        let configDirectoryPath: string = path.join(__dirname, '..', '..', 'config');
        EnvReader.loadEnvFile(configDirectoryPath, process.env.NODE_ENV, true);

        // Initializing App + Logger
        this.application = express();
        this.port = process.env.FILE_MANAGEMENT_SERVICE_PORT as unknown as number || 5000;
        let logger = new Logger(process.env.FILE_MANAGEMENT_SERVICE_NAME);

        // Initializing Components
        let database = new MongoDb(process.env.DATABASE_HOST!, process.env.DATABASE_PORT!, 
            process.env.FILE_MANAGEMENT_SERVICE_DATABASE_NAME!);
        database.connectDatabase();
        let messageBroker = new Kafka(process.env.KAFKA_HOST!, process.env.KAFKA_PORT! as unknown as number);

        // Initializing Middlewares
        this.initializeMiddlewares();

        // Initializing Error Handling
        this.initializeErrorHandling();

        // Event Publisher
        let eventPublisher = new EventPublisher(logger.getLogger(), messageBroker);

        // Initializing Repository
        let repository = new FileRepository(logger.getLogger());

        // Initializing File System Manager
        let fileSystemManager = new FileSystemManager(logger.getLogger());

        // Initializing Service
        let service = new FileService(logger.getLogger(), repository, eventPublisher, fileSystemManager);

        // Initializing Controller + Routes
        let controllers = new FileController(this.application, logger.getLogger(), service);
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
            console.log(`File Management Service listening on the port ${this.port}`);
        });
    }
}

export default FileManagementApplication;
