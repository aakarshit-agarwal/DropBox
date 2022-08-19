import morgan from 'morgan';
import { Application } from "express";


export default class Logging {
    initializeLogger(application: Application) {
        application.use(morgan('combined'));
    }
}
