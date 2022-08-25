import Logging from '@dropbox/common_library/logging/Logging';

class Logger {
    private logger: Logging | undefined;

    constructor(name?: string) {
        if(name === undefined) {
            console.log("Service name is not defined, skipping logging initialization.");
            return;
        }
        this.logger = new Logging(name);
    }

    getLogger() {
        return this.logger;
    }
}

export default Logger;
