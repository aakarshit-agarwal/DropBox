import express from 'express';
import path from 'path';
import EnvReader from '@dropbox/common_library/config/EnvReader';
import Logging from './logging/Logging';
import Proxy from './proxy/Proxy';
import RateLimiter from './rateLimiter/RateLimiter';


export default class ApiGatway {
    public application: express.Application;
    public logging: Logging;
    public proxy: Proxy;
    public rateLimiter: RateLimiter;
    public port: string | number;
    
    constructor() {
        // Initializing Config
        let configDirectoryPath: string = path.join(__dirname, '..', '..', 'config');
        EnvReader.loadEnvFile(configDirectoryPath, process.env.NODE_ENV, true);

        this.application = express();
        this.logging = new Logging();
        this.proxy = new Proxy();
        this.rateLimiter = new RateLimiter();
        this.port = process.env.API_GATEWAY_PORT || 5000;

        this.initializeLogger();
        this.setupProxy();
        this.setupRateLimiter();
    }

    private initializeLogger() {
        this.logging.initializeLogger(this.application);
    }

    private setupProxy() {
        this.proxy.setupProxy(this.application);
    }

    private setupRateLimiter() {
        this.rateLimiter.initializeRateLimiter(this.application);
    }

    public listen() {
        this.application.listen(this.port, () => {
            console.log(`API Gateway listening on the port ${this.port}`);
        });
    }
}
