export interface ILogger {
    // Example of loggingMetadata is correlationVector
    error(msg: string, logObject?: any, loggingMetadata?: string): void; 
    warn(msg: string, logObject?: any, loggingMetadata?: string): void;
    info(msg: string, logObject?: any, loggingMetadata?: string): void;
    verbose(msg: string, logObject?: any, loggingMetadata?: string): void;
    debug(msg: string, logObject?: any, loggingMetadata?: string): void;
    getConfiguredTransports(): Array<any>;
    addTransport(transportObject: any): void;
    removeTransport(transportObject: any): void;
}
