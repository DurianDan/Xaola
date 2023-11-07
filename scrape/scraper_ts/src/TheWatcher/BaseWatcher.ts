interface WatchConfig {
    level?: 'warn' | 'info' | 'error';
    suffix?: string;
    prefix?: string;
}
interface WatchThings {
    msg: string;
    err?: Error;
}
interface BaseWatcher {
    config: WatchConfig;
    /**
     * Generate message for logger
     * @param {any} watchThings?:WatchThings if parsed will overwrite the this.config (WatchConfig)
     * @returns {any} log message
     */
    generateMessage(watchThings: WatchThings): string;
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
    checkObjectToLog(toCheck: any): boolean;
    /**
     * Utilize `this.checkObjectToLog` to check if the parsed object is undefined/null/empty-object/blank-string, if it is, execute `this.info`
     * @param {any} toCheck:any
     * @param {any} watchThings:WatchThings
     * @returns {any}
     */
    checkInfo(toCheck: any, watchThings: WatchThings): void;
    /**
     * Utilize `this.checkObjectToLog` to check if the parsed object is undefined/null/empty-object/blank-string, if it is, execute `this.warn`
     * @param {any} toCheck:any
     * @param {any} watchThings:WatchThings
     * @returns {any}
     */
    checkWarn(toCheck: any, watchThings: WatchThings): void;
    /**
     * Utilize `this.checkObjectToLog` to check if the parsed object is undefined/null/empty-object/blank-string, if it is, execute `this.error`
     * @param {any} toCheck:any
     * @param {any} watchThings:WatchThings
     * @returns {any}
     */
    checkError(toCheck: any, watchThings: WatchThings): void;
    /**
     * if this.config.level is "info" or "warn", execute `this.log`
     * @param {any} watchThings:WatchThings
     * @returns {any}
     */
    info(watchThings: WatchThings): void;
    /**
     * if this.config.level is "warn", execute `this.log`
     * @param {any} watchThings:WatchThings
     * @returns {any}
     */
    warn(watchThings: WatchThings): void;
    /**
     * if this.config.level is "info" or "error" or "warn", execute `this.log`
     * @param {any} watchThings:WatchThings
     * @returns {any}
     */
    error(watchThings: WatchThings): void;
}

export { BaseWatcher, WatchConfig, WatchThings };
