import { isEmpty } from 'lodash';
import { WatchConfig, BaseWatcher, WatchThings } from './BaseWatcher';

class ConsoleWatcher implements BaseWatcher {
    public constructor(public config: WatchConfig) {
        this.config = config;
    }
    generateMessage(watchThings: WatchThings): string {
        return (
            new Date().toISOString() +
            '-' +
            (watchThings.level ? watchThings.level + '-' : '') +
            watchThings.msg +
            (watchThings.err ? watchThings.err + '\n' : '')
        );
    }
    log(msg: string): void {
        console.log(msg);
    }
    info(watchThings: WatchThings): void {
        if (this.config.level && ['info', 'warn'].includes(this.config.level)) {
            this.log(this.generateMessage({ level: 'INFO', ...watchThings }));
        }
    }
    error(watchThings: WatchThings): void {
        if (
            this.config.level &&
            ['info', 'warn', 'error'].includes(this.config.level)
        ) {
            this.log(this.generateMessage({ level: 'ERROR', ...watchThings }));
        }
    }
    warn(watchThings: WatchThings): void {
        if (this.config.level === 'warn') {
            this.log(this.generateMessage({ level: 'WARN', ...watchThings }));
        }
    }
    checkObjectToLog(toCheck: any): boolean {
        return !toCheck || isEmpty(toCheck) || toCheck === '';
    }
    checkInfo<T>(toCheck: T, watchThings: WatchThings): T {
        if (this.checkObjectToLog(toCheck)) {
            this.info(watchThings);
        }
        return toCheck;
    }
    checkError<T>(toCheck: T, watchThings: WatchThings): T {
        if (this.checkObjectToLog(toCheck)) {
            this.error(watchThings);
        }
        return toCheck;
    }
    checkWarn<T>(toCheck: T, watchThings: WatchThings): T {
        if (this.checkObjectToLog(toCheck)) {
            this.info(watchThings);
        }
        return toCheck;
    }
}

export { ConsoleWatcher };
