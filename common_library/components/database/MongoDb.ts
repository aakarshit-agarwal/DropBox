import mongoose, { Connection } from 'mongoose';
import {inject, injectable} from "inversify";
import "reflect-metadata";

@injectable()
export default class MongoDb {
    public connection: Connection;
    private url: string;

    constructor(
        @inject("DATABASE_HOST") host: string, 
        @inject("DATABASE_PORT") port: number, 
        @inject("DATABASE_NAME") name: string
    ) {
        let databaseURL: string = `mongodb://${host}:${port}/${name}`;
        console.log("Database connection URL:", databaseURL);
        this.url = databaseURL;
    }

    public connectDatabase() {
        mongoose.connect(this.url, {});
        this.connection = mongoose.connection;
        this.addListeners();
    }

    private addListeners() {
        this.connection.on('connected', () => {
            console.log('database is connected successfully');
        });
        this.connection.on('disconnected', () => {
            console.log('database is disconnected successfully');
        });
        this.connection.on('error', () => {
            console.error.bind(console, 'connection error:');
        });
    }
}
