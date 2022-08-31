// Package Imports
import "reflect-metadata";
import bodyParser from 'body-parser';
import cors from 'cors';
import express, { Application } from 'express';
import { inject, injectable } from "inversify";

// Common Library Imports
import ErrorHandling from '@dropbox/common_library/middlewares/ErrorHandling';
import Logging from '@dropbox/common_library/logging/Logging';
import MongoDb from '@dropbox/common_library/components/database/MongoDb';

// Local Imports
import DependencyTypes from "./DependencyTypes";
import EventReceiver from './events/EventReceiver';
import UserController from './controllers/UserController';


@injectable()
class UserManagementApplication {
    private logger: Logging;
    private application: express.Application;
    private database: MongoDb;
    private controller: UserController;
    private eventReceiver: EventReceiver;
    private port: number;
    
    constructor(
        @inject(DependencyTypes.Logger) logger: Logging, 
        @inject(DependencyTypes.Application) application: Application,
        @inject(DependencyTypes.Database) database: MongoDb,
        @inject(DependencyTypes.UserController) controller: UserController,
        @inject(DependencyTypes.EventReceiver) eventReceiver: EventReceiver
    ) {
        this.logger = logger;
        this.application = application;
        this.database = database;
        this.controller = controller;
        this.eventReceiver = eventReceiver;
        this.port = process.env.USER_MANAGEMENT_SERVICE_PORT as unknown as number || 5000;
        this.startApplication();
    }

    async startApplication() {   
        this.logger.logInfo("Starting application");

        // Conect Database
        this.database.connectDatabase();

        // Initializing Middlewares
        this.initializeMiddlewares();

        // Initializing Controller + Routes
        this.controller.initializeRoutes();

        // Initializing Event Receiver
        await this.eventReceiver.startListening();
        
        // Initializing Error Handling
        this.initializeErrorHandling();
    }

    private initializeMiddlewares() {
        this.logger.logDebug("Adding Middlewares");
        this.application.use(bodyParser.json());
        this.application.use(bodyParser.urlencoded({
            extended: false
        }));
        this.application.use(cors());
    }

    private initializeErrorHandling() {
        this.logger.logDebug("Adding Error Handling");
        this.application.use(ErrorHandling.handle);
    }

    public listen() {
        this.application.listen(this.port, () => {
            let message = `User Management Service listening on the port ${this.port}`;
            console.log(message);
            this.logger.logInfo(message);
        });
    }

}

export default UserManagementApplication;
