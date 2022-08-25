import mongoose, { Connection } from 'mongoose';

export default class MongoDb {

    public connection: Connection;

    constructor(host: string, port: string, name: string) {
        let databaseURL: string = `mongodb://${host}:${port}/${name}`;
        console.log("Database connection URL:", databaseURL);
        this.connectDatabase(databaseURL);
        this.connection = mongoose.connection;
        this.addListeners();
    }

    private connectDatabase(url: string) {
        mongoose.connect(url, {});
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
