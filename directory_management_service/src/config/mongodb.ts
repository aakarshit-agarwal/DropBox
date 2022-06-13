import mongoose, { Connection } from 'mongoose';

export default class MongoDbConnection {

    public connection: Connection;

    constructor() {
        this.connectDatabase();
        this.connection = mongoose.connection;
        this.addListeners();
    }

    private connectDatabase() {
        console.log(process.env.MONGO_URL);
        mongoose.connect(process.env.MONGO_URL!, {});
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
