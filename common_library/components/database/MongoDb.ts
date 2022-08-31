// Package Imports
import "reflect-metadata";
import mongoose, { Connection } from 'mongoose';
import {inject, injectable} from "inversify";

// Common Library Imports
import DependencyTypes from "./../../GlobalTypes";
import Logging from "./../../logging/Logging";

// Local Imports

@injectable()
export default class MongoDb {
    public connection: Connection;
    private logger: Logging;
    private url: string;

    constructor(
        @inject(DependencyTypes.Logger) logger: Logging, 
        @inject("DATABASE_HOST") host: string, 
        @inject("DATABASE_PORT") port: number, 
        @inject("DATABASE_NAME") name: string
    ) {
        this.logger = logger;
        let databaseURL: string = `mongodb://${host}:${port}/${name}`;
        this.logger.logDebug(`Database connection URL: ${databaseURL}`);
        this.url = databaseURL;
    }

    public connectDatabase() {
        this.logger.logDebug("Connecting database");
        mongoose.connect(this.url, {});
        this.connection = mongoose.connection;
        this.addListeners();
    }

    private addListeners() {
        this.logger.logDebug("Adding database listeners");
        this.connection.on('connected', () => {
            this.logger.logInfo('Database is connected successfully');
        });
        this.connection.on('disconnected', () => {
            this.logger.logInfo('Database is disconnected successfully');
        });
        this.connection.on('error', error => {
            this.logger.logError('Database connection error', {error: error});
        });
    }
}
