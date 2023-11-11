import { isEmpty } from 'lodash';
import { WatchConfig, BaseWatcher, WatchThings } from './BaseWatcher';

class ConsoleWatcher implements BaseWatcher {
    public constructor(public config: WatchConfig) {
        this.config = config;
    }
    generateMessage(watchThings: WatchThings): string {
        return watchThings.msg ?? '' + (watchThings.err ?? '');
    }
    log(msg: string): void {
        console.log(msg);
    }
    info(watchThings: WatchThings): void {
        if (this.config.level && ['info', 'warn'].includes(this.config.level)) {
            this.log(this.generateMessage(watchThings));
        }
    }
    error(watchThings: WatchThings): void {
        if (
            this.config.level &&
            ['info', 'warn', 'error'].includes(this.config.level)
        ) {
            this.log(this.generateMessage(watchThings));
        }
    }
    warn(watchThings: WatchThings): void {
        if (this.config.level === 'warn') {
            this.log(this.generateMessage(watchThings));
        }
    }
    checkObjectToLog(toCheck: any): boolean {
        return !toCheck || isEmpty(toCheck) || toCheck === '';
    }
    checkInfo(toCheck: any, watchThings: WatchThings): void {
        if (this.checkObjectToLog(toCheck)) {
            this.info(watchThings);
        }
    }
    checkError(toCheck: any, watchThings: WatchThings): void {
        if (this.checkObjectToLog(toCheck)) {
            this.error(watchThings);
        }
    }
    checkWarn(toCheck: any, watchThings: WatchThings): void {
        if (this.checkObjectToLog(toCheck)) {
            this.info(watchThings);
        }
    }
}

export { ConsoleWatcher };
