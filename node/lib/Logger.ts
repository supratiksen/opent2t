import {ILogger} from "./ILogger";
import {Utilities} from "./LoggerUtilities";
import {LoggerInstance} from "winston";
import * as winston from "winston";

const timeStamp: string = "timestamp";

export class Logger implements ILogger {
    private static flag: boolean = true;
    private globalLogLevel: string = "debug";
    private logger: LoggerInstance;
    private transportList: Array<any> = [];

    constructor(logLevel?: string, filename?: string, logger?: LoggerInstance) {
        this.logger = logger || <any> winston;

        // TODO: Gate loglevel strings to allowed/supported values only.
        if (logLevel) {
            this.globalLogLevel = logLevel;
        }

        let consoleTransport = new winston.transports.Console({
            colorize: true,
            level: this.globalLogLevel,
        });

        this.logger.configure({
            transports: [
                consoleTransport,
            ],
        });

        this.transportList.push(consoleTransport);

        if (Logger.flag === true && filename) {
            let fileTransport = new winston.transports.File({
                filename: filename,
                handleExceptions: true,
                level: this.globalLogLevel,
            });

            this.logger.configure({
                transports: [
                    consoleTransport,
                    fileTransport,
                ],
            });

            this.transportList.push(fileTransport);
            Logger.flag = false;
        }
    }

   public error(msg: string, logMetadata?: string, logObject?: any): void {
        this.logger.error(msg, logMetadata, logObject);
    }

    public warn(msg: string, logMetadata?: string, logObject?: any): void {
        this.logger.warn(msg, logMetadata, logObject);
    }

    public info(msg: string, logMetadata?: string, logObject?: any): void {
        this.logger.info(msg, logMetadata, logObject);
    }

    public verbose(msg: string, logMetadata?: string, logObject?: any): void {
        this.logger.verbose(msg, logMetadata, logObject);
    }

    public debug(msg: string, logMetadata?: string, logObject?: any): void {
        this.logger.debug(msg, logMetadata, logObject);
    }

    public getConfiguredTransports(): Array<any> {
        return this.transportList;
    }

    public addTransport(transportObject: any): void {
        this.logger.add(transportObject);

        this.transportList.push(transportObject);
    }

    public removeTransport(transportObject: any): void {
        this.logger.remove(transportObject);

        let index = this.transportList.indexOf(transportObject);
        if (index > -1) {
            this.transportList.splice(index, 1);
        }
    }

    public normalizeWith(normalizer: (logObject: any) => any): ILogger {
        this.normalize = normalizer;
        return this;
    }

    private normalize = (logObject: any) => {
        if (logObject === null || logObject === undefined) {
            return;
        }

        let cLogObject = Utilities.cloneObject(logObject);
        cLogObject[timeStamp] = Date.now();
        return cLogObject;
    };
}
