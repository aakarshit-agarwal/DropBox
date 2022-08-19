import rateLimit from 'express-rate-limit';
import { Application } from 'express';
import Router from './../router/Router';

export default class RateLimiter {
    router: Router

    constructor() {
        this.router = new Router();
    }

    initializeRateLimiter(application: Application) {
        let routes = this.router.getRoutes();

        routes.forEach((route: any) => {
            if(route.rateLimit) {
                application.use(route.url, rateLimit(route.rateLimit));
            }
        });
    }
}
