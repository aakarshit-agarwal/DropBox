import dotEnv from 'dotenv';

export default class EnvironmentVariables {
    constructor() {
        this.loadEnvFile();
    }

    private loadEnvFile() {
        let configFilePath: string = `/.env`;

        if (process.env.NODE_ENV) {
            configFilePath =  `/.env.${process.env.NODE_ENV}`;
        }
        dotEnv.config({ path:  __dirname + configFilePath, debug: true });
    }
}