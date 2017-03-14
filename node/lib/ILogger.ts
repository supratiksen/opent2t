export interface ILogger {
    // Example of loggingMetadata is correlationVector
    error(msg: string, logObject?: any, logMetadata?: string): void;
    warn(msg: string, logMetadata?: string, logObject?: any): void;
/*    warn(msg: string, logObject?: any, logMetadata?: string): void;
    warn(msg: string, logParams?: Map<any, string>): void;
    warn(msg: string, logParams?: Array<any>): void;*/

    info(msg: string, logObject?: any, logMetadata?: string): void;
    verbose(msg: string, logObject?: any, logMetadata?: string): void;
    debug(msg: string, logObject?: any, logMetadata?: string): void;
    getConfiguredTransports(): Array<any>;
    addTransport(transportObject: any): void;
    removeTransport(transportObject: any): void;
}
