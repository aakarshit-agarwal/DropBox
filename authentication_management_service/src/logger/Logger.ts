import Logging from '@dropbox/common_library/logging/Logging';

class Logger {
    private logger: Logging;

    constructor() {
        this.logger = new Logging("authentication_management_service");
    }

    getLogger() {
        return this.logger;
    }
}

export default new Logger().getLogger();