import winston from 'winston';
import DailyRotateFile from 'winston-daily-rotate-file';
import {performance} from 'perf_hooks';

let logger: Logging;

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
                winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss.SSS' }), 
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
                winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss.SSS' }), 
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
        logger = this;
    }

    private maskData(data: any) {
        if(data === undefined) {
            return
        } else if(Object.getPrototypeOf(data) === Object.getPrototypeOf({})) {
            data = this.maskSecretsObject(data);
        } else if(Object.getPrototypeOf(data) === Object.getPrototypeOf([])) {
            data = this.maskSecretsList(data);
        } else {
            data = JSON.stringify(data)
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
        for(let itr = 0; itr < object.length; ++itr) {
            if(typeof object[itr] === typeof {}) {
                object[itr] = this.maskSecretsObject(object[itr]);
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

export function LogMethodArgsAndReturn(target: Object, propertyKey: string, descriptor: TypedPropertyDescriptor<any>) {
    const originalMethod = descriptor.value;

    descriptor.value = function(...args: any[]) {
        logger.logDebug(`Entering [method: ${propertyKey}]`, args);
        let start = performance.now();
        const result = originalMethod.apply(this, args);
        let end = performance.now();
        logger.logDebug(`Leaving [method: ${propertyKey}] [${(end - start).toFixed(2)} ms]`, result);
        return result;
    };

    return descriptor;
}

export default Logging;
