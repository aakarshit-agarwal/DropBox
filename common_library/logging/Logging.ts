import winston from 'winston';
import DailyRotateFile from 'winston-daily-rotate-file';

class Logging {
    private logLevel: string = process.env.NODE_ENV === 'prod' ? 'info' : 'debug';
    private logFormat = winston.format.printf(({ level, message, timestamp, label}) => {
        let msg = `[${timestamp}] [${level}] [${label}]: ${message}`;
        return msg;
    });
    private maskingFields = ['password', 'access_token'];
    private logger: winston.Logger;

    constructor(servicename: string) {
        let consoleTransport = new winston.transports.Console({
            format: winston.format.combine(
                winston.format.colorize({all:true}),
                winston.format.label({ label: servicename }),
                winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }), 
                winston.format.prettyPrint(),
                this.logFormat
            )                    
        });

        let fileTransport = new DailyRotateFile({
            json: true,
            level: this.logLevel,
            filename: 'logs/application-%DATE%.log',
            datePattern: 'YYYY-MM-DD-HH',
            zippedArchive: false,
            maxSize: '20m',
            maxFiles: '14d',
            format: winston.format.combine(
                winston.format.label({ label: servicename }),
                winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }), 
                winston.format.metadata({ fillExcept: ['message', 'timestamp', 'level', 'label'] }),
                winston.format.prettyPrint(),
            )
        });
        fileTransport.on('rotate', function(_oldFilename, _newFilename) {
            // do something fun
        });


        let loggerOptions = {
            level: this.logLevel,
            transports: [
                consoleTransport,
                fileTransport
            ],
            exitOnError: false
        }
        
        this.logger = winston.createLogger(loggerOptions);
    }

    private maskData(data: any) {
        if(data === undefined) {
            return
        } else if(typeof data === typeof {}) {
            data = this.maskSecretsObject(data);
        } else {
            data = this.maskSecretsList(data);
        }
        return data;
    }

    private maskSecretsObject(object: any) {
        for(let entry of Object.keys(object)) {
            if(this.maskingFields.includes(entry)) {
                if(typeof object[entry] === typeof {}) {
                    object[entry] = this.maskSecretsObject(object[entry]);
                } else if(typeof object[entry] === typeof []) {
                    object[entry] = this.maskSecretsList(entry);
                } else {
                    object[entry] = '[SECRET]';
                }
            }
        }
        return object
    }

    private maskSecretsList(object: any) {
        for(let entry of Object.keys(object)) {
            if(this.maskingFields.includes(entry)) {
                if(typeof object[entry] === typeof {}) {
                    object[entry] = this.maskSecretsObject(object[entry]);
                } else if(typeof object[entry] === typeof []) {
                    object[entry] = this.maskSecretsList(entry);
                } else {
                    object[entry] = '[SECRET]';
                }
            }
        }
        return object;
    }

    logInfo(message: any, data?: any) {
        this.logger.info(message, this.maskData(data));
    }

    logError(message: any, data?: any) {
        this.logger.error(message, this.maskData(data));
    }
    logWarn(message: any, data?: any) {
        this.logger.warn(message, this.maskData(data));
    }
    logDebug(message: any, data?: any) {
        this.logger.debug(message, this.maskData(data));
    }

}

export default Logging;
