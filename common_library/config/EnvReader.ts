import dotEnv from 'dotenv';
import path from 'path';

export default class EnvReader {
    constructor(directoryPath: string, environment?: string, debug?: boolean) {
        this.loadEnvFile(directoryPath, environment, debug);
    }

    private loadEnvFile(directoryPath: string, env?: string, debug: boolean = false) {
        let configFileName: string = `/.env`;

        if (env !== undefined && env.length > 0) {
            configFileName =  `/.env.${env}`;
        }

        let configFilePath = path.join(directoryPath, configFileName);
        console.log("Loading config from Path: " + configFilePath);
        dotEnv.config({ path:  configFilePath, debug: debug });
    }
}
