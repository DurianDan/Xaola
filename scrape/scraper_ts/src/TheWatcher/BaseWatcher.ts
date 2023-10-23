interface WatchConfig{
    level?: "warn"|"info"|"error",
    suffix?: string,
    prefix?: string
}
interface WatchThings{
    msg: string,
    err?: Error,
    suffix?: string,
    prefix?: string
}
interface BaseWatcher{
    config: WatchConfig;
    /**
     * Generate message for logger
     * @param {any} customConfig?:watchThings if parsed will overwrite the this.config (WatchConfig)
     * @returns {any} log message
     */
    generateMessage(watchThings:WatchThings): string;
    /**
     * Directly log the message into a console, or a file, or anything
     * @param {any} msg:string message to log
     * @returns {any}
     */
    log(msg: string): void;
    /**
     * Check an object to be undefined/null/empty-object/blank-string
     * @param {any} toCheck:any object to check
     * @returns {any} boolean: true if needs to be log
     */
    checkObjectToLog(toCheck: any):boolean;
    checkInfo(toCheck:any, watchThings:WatchThings): void
    checkWarn(toCheck: any, watchThings:WatchThings): void
    checkError(toCheck: any, watchThings:WatchThings): void
    info(watchThings: WatchThings):void;
    warn(watchThings: WatchThings):void;
    error(watchThings: WatchThings):void;
}

export {BaseWatcher, WatchConfig, WatchThings};