import dotEnv from 'dotenv';
import path from 'path';

export default class EnvironmentVariables {
    constructor(localProjectPath?: string) {
        this.loadGlobalEnvFile();
        if(localProjectPath !== undefined) {
            this.loadLocalEnvFile(localProjectPath);
        }
    }

    private loadGlobalEnvFile() {
        let configFileName: string = `/.env`;

        if (process.env.NODE_ENV) {
            configFileName =  `/.env.${process.env.NODE_ENV}`;
        }

        let configFilePath = path.join(__dirname, '../', 'resources/', configFileName);
        console.log("Loading config from Path: " + configFilePath);
        dotEnv.config({ path:  configFilePath, debug: true });
    }   
    
    private loadLocalEnvFile(localProjectPath: string) {
        let configFileName: string = `/.env`;
        if (process.env.NODE_ENV) {
            configFileName =  `/.env.${process.env.NODE_ENV}`;
        }
        let configFilePath = path.join(localProjectPath, configFileName);
        console.log("Loading config from Path: " + configFilePath);
        dotEnv.config({ path:  configFilePath, debug: true, override: true});
    }
}
