import EventMessageModel from '@dropbox/common_library/models/events/EventMessageModel';
import EventTypeModel from '@dropbox/common_library/models/events/EventTypeModel';
import UserDeletedEventModel from '@dropbox/common_library/models/events/UserDeletedEventModel';
import AuthenticationService from './../service/AuthenticationService';
import Logging from '@dropbox/common_library/logging/Logging';
import Kafka, {Receiver} from '@dropbox/common_library/components/messageBroker/Kafka';

export default class EventReceiver {
    private logger: Logging;
    private broker: Kafka;
    private authenticationService: AuthenticationService;
    private eventReceiver: Receiver;

    constructor(logger: Logging, broker: Kafka, authenticationService: AuthenticationService) {
        this.logger = logger;
        this.broker = broker;
        this.authenticationService = authenticationService;

        let topics = [EventTypeModel.DELETE_USER];
        this.eventReceiver = this.broker.initializeReceiver(topics);
    }

    public startListening() {
        this.eventReceiver.receiveMessage((data: EventMessageModel) => {
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
