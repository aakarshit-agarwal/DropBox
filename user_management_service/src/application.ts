import express, { Application } from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import container from "./inversify.config";
import TYPES from "./types";
import ErrorHandling from '@dropbox/common_library/middlewares/ErrorHandling';
import MongoDb from '@dropbox/common_library/components/database/MongoDb';
import Kafka from '@dropbox/common_library/components/messageBroker/Kafka';
import UserController from './controllers/UserController';
import EventReceiver from './events/EventReceiver';


class UserManagementApplication {
    private application: express.Application;
    private port: number;
    private messageBroker: Kafka;
    
    constructor() {
        this.initializeAplication();
    }

    async initializeAplication() {

        this.port = process.env.USER_MANAGEMENT_SERVICE_PORT as unknown as number || 5000;
        this.application = container.get<Application>(TYPES.Application);
        
        // Initializing Components
        let database = container.get<MongoDb>(TYPES.Database);
        database.connectDatabase();
        await this.initializeMessageBroker();

        // Initializing Middlewares
        this.initializeMiddlewares();

        // Initializing Controller + Routes
        let controllers = container.get<UserController>(TYPES.UserController);
        controllers.initializeRoutes();

        // Initializing Event Receiver + Listeners
        let eventReceiver = container.get<EventReceiver>(TYPES.EventReceiver);
        await eventReceiver.startListening();
        
        // Initializing Error Handling
        this.initializeErrorHandling();
    }

    private async initializeMessageBroker() {
        this.messageBroker = container.get<Kafka>(TYPES.MessageBroker);
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
            console.log(`User Management Service listening on the port ${this.port}`);
        });
    }

}

export default UserManagementApplication;
