import { WatchConfig, BaseWatcher, WatchThings } from "./BaseWatcher";

class ConsoleWatcher implements BaseWatcher{
    constructor(
        public config: WatchConfig
    ){
        this.config = config
    }
    generateMessage(watchThings: WatchThings): string {
        let prefix = watchThings.prefix??this.config.prefix
        prefix = prefix? prefix:"";
        let suffix = watchThings.suffix??this.config.suffix
        suffix = suffix? suffix:"";
        let msg = watchThings.msg??""
        return prefix+msg+suffix+watchThings.err??""
    }
    log(msg: string): void {
        console.log(msg);
    }
    checkInfo(toCheck: any, watchThings: WatchThings): void {
        if (!toCheck){
            this.log(this.generateMessage(watchThings))
        }
    }
    info(watchThings: WatchThings): void {
        if (
            this.config.level
            && ["info","warn"].includes(this.config.level)
        ){
            this.log(this.generateMessage(watchThings))
        }
    }
    error(watchThings: WatchThings): void {
        if (this.config.level){
            this.log(this.generateMessage(watchThings))
        }
    }
    warn(watchThings: WatchThings): void {
        if (this.config.level==="warn"){
            this.log(this.generateMessage(watchThings))
        }
    }
}

export { ConsoleWatcher };