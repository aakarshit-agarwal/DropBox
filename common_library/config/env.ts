import dotEnv from 'dotenv';
import path from 'path';

export default class EnvironmentVariables {
    constructor(localProjectPath?: string) {
        this.loadGlobalEnvFile();
        if(localProjectPath !== undefined) {    // Here check if file is present
            this.loadLocalEnvFile(localProjectPath);
        }
    }

    private loadGlobalEnvFile() {
        let configFilePath: string = `/.env`;

        if (process.env.NODE_ENV) {
            configFilePath =  `/.env.${process.env.NODE_ENV}`;
        }
        dotEnv.config({ path:  path.join(__dirname, '../', configFilePath), debug: true });
    }   
    
    private loadLocalEnvFile(localProjectPath: string) {
        let configFilePath: string = `/.env`;

        if (process.env.NODE_ENV) {
            configFilePath =  `/.env.${process.env.NODE_ENV}`;
        }
        dotEnv.config({ path:  path.join(localProjectPath, configFilePath), debug: true, override: true});
    }
}