import {createProxyMiddleware} from 'http-proxy-middleware';
import Router from './../router/Router';
import { Application } from 'express';

export default class Proxy {
    router: Router;

    constructor() {
        this.router = new Router();
    }

    setupProxy(application: Application) {
        let routes = this.router.getRoutes();
        routes.forEach((route: any) => {
            application.use(route.url, createProxyMiddleware(route.proxy));
        });
    }
}
