import { Connection } from "mongoose";
import EnvironmentVariables from "./env";
import MongoDbConnection from "./mongodb";

export default class Config {
    public envConfig: EnvironmentVariables | undefined;
    public dbConnection: Connection | undefined;

    constructor() {
        this.initializeConfig();
    }

    private async initializeConfig() {
        this.envConfig = await this.initializeEnv();
        this.dbConnection = await this.initializeDatabase();
    }

    private async initializeEnv() {
        return new EnvironmentVariables();
    }

    private async initializeDatabase() {
        let database = new MongoDbConnection();
        return database.connection;
    }
}
