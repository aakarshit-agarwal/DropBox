import express from 'express';
import path from 'path';
import Config from '@dropbox/common_library/config';
import Logging from './logging/Logging';
import Proxy from './proxy/Proxy';
import RateLimiter from './rateLimiter/RateLimiter';


export default class ApiGatway {
    public application: express.Application;
    public logging: Logging;
    public proxy: Proxy;
    public rateLimiter: RateLimiter;
    public config: Config;
    public port: string | number;
    
    constructor() {
        this.application = express();
        this.logging = new Logging();
        this.proxy = new Proxy();
        this.rateLimiter = new RateLimiter();
        this.config = new Config(path.join(__dirname, 'resources/'));
        this.port = process.env.PORT || 5000;

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
