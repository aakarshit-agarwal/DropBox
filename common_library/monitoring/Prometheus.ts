// Package Imports
import "reflect-metadata";
import client from 'prom-client';
import {inject, injectable} from "inversify";

// Common Library Imports
import DependencyTypes from "./../GlobalTypes";
import Logging from "./../logging/Logging";

// Local Imports


@injectable()
export default class Prometheus {
    registry: client.Registry;

    constructor(
        @inject(DependencyTypes.Logger) logger: Logging, 
        @inject("SERVICE_NAME") servicename: string
    ) {
        this.registry = new client.Registry();
        this.collectDefaultMetrics(servicename);
    }

    collectDefaultMetrics(prefix: string) {
        client.collectDefaultMetrics({
            register: this.registry,
            prefix: prefix + '_'
        });
    }

    getMetrics() {
        this.registry.metrics();
    }
}
