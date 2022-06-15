import { Connection } from "mongoose";
import EnvironmentVariables from "./env";
import MongoDbConnection from "./mongodb";

export default class Config {
    public envConfig: EnvironmentVariables | undefined;
    public dbConnection: Connection | undefined;

    constructor(localProjectPath?: string) {
        this.initializeConfig(localProjectPath);
    }

    private async initializeConfig(localProjectPath?: string) {
        this.envConfig = await this.initializeEnv(localProjectPath);
        this.dbConnection = await this.initializeDatabase();
    }

    private async initializeEnv(localProjectPath?: string) {
        return new EnvironmentVariables(localProjectPath);
    }

    private async initializeDatabase() {
        let database = new MongoDbConnection();
        return database.connection;
    }
}
