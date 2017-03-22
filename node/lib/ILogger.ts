export interface ILogger {
    // Example of logMetadata is correlationVector
    error(msg: string, logMetadata?: string, logObject?: any): void;
    warn(msg: string, logMetadata?: string, logObject?: any): void;
    info(msg: string, logMetadata?: string, logObject?: any): void;
    verbose(msg: string, logMetadata?: string, logObject?: any): void;
    debug(msg: string, logMetadata?: string, logObject?: any): void;
    getConfiguredTransports(): Array<any>;
    addTransport(transportObject: any): void;
    removeTransport(transportObject: any): void;
}
