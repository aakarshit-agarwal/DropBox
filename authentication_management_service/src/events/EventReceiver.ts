import EventConsumer from '@dropbox/common_library/events/EventConsumer';
import EventMessageModel from '@dropbox/common_library/models/events/EventMessageModel';
import EventTypeModel from '@dropbox/common_library/models/events/EventTypeModel';
import UserDeletedEventModel from '@dropbox/common_library/models/events/UserDeletedEventModel';
import AuthenticationService from './../service/AuthenticationService';
import Logging from '@dropbox/common_library/logging/Logging';

export default class EventReceiver {
    private logger: Logging;
    private topics: EventTypeModel[];
    private eventConsumer: EventConsumer;
    private authenticationService: AuthenticationService;

    constructor(applicationContext: any) {
        this.logger = applicationContext.logger;
        this.topics = [EventTypeModel.DELETE_USER];
        this.eventConsumer = new EventConsumer(this.topics, `${process.env.KAFKA_HOST}:${process.env.KAFKA_PORT}`);
        this.authenticationService = new AuthenticationService(applicationContext);
    }

    public startListening() {
        this.eventConsumer.receiveMessage((data: EventMessageModel) => {
            this.handleEvents(data);
        });
    }

    private handleEvents(data: EventMessageModel) {
       this.logger.logInfo(`Calling handleEvents with data: ${data}`);
        let topic = data.topic as EventTypeModel;
        let message = JSON.parse(data.value as string);
        switch(topic) {
            case EventTypeModel.DELETE_USER: {
                this.handleDeleteUserEvent(message);
                break;
            }
        }
       this.logger.logInfo(`Returning handleEvents`);
    }

    private async handleDeleteUserEvent(userDeletedEventModel: UserDeletedEventModel) {
       this.logger.logInfo(`Calling handleDeleteUserEvent with UserDeletedEventModel: ${userDeletedEventModel}`);
       await this.authenticationService.invalidateAccessTokenForUser(userDeletedEventModel._id);
       this.logger.logInfo(`Returning handleDeleteUserEvent`);
    }
}
