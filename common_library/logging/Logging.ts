import {createLogger, format, transports, Logger} from 'winston';

class Logging {
    private logger: Logger;

    constructor(servicename: string) {
        this.logger = createLogger({
            format: format.combine(format.timestamp(), format.json()),
            defaultMeta: {
                service: servicename,
            },         
            transports: [
                // new transports.Console(),
                new transports.File({ filename: "./logs/file.log", dirname: "logs" }),
            ],
            exceptionHandlers: [new transports.File({ filename: "exceptions.log", dirname: "logs" })],
            rejectionHandlers: [new transports.File({ filename: "rejections.log", dirname: "logs" })],
        });
    }

    logInfo(message: any) {
        this.logger.info(message);
    }

    logError(message: any) {
        this.logger.error(message);
    }
    logWarn(message: any) {
        this.logger.warn(message);
    }
    logDebug(message: any) {
        this.logger.debug(message);
    }
}

export default Logging;
