import EventMessageModel from '@dropbox/common_library/models/events/EventMessageModel';
import EventTypeModel from '@dropbox/common_library/models/events/EventTypeModel';
import UserDeletedEventModel from '@dropbox/common_library/models/events/UserDeletedEventModel';
import AuthenticationService from './../service/AuthenticationService';
import Logging from '@dropbox/common_library/logging/Logging';
import Kafka from '@dropbox/common_library/components/messageBroker/Kafka';

export default class EventReceiver {
    private logger: Logging;
    private eventBroker: Kafka;
    private authenticationService: AuthenticationService

    constructor(logger: Logging, broker: Kafka, authenticationService: AuthenticationService) {
        this.logger = logger;
        this.eventBroker = broker;
        this.authenticationService = authenticationService;
    }

    public async startListening() {
        this.logger.logInfo(`Initializing event receiver`);
        let topics = [EventTypeModel.DELETE_DIRECTORY, EventTypeModel.CREATE_USER, EventTypeModel.DELETE_USER];
        await this.eventBroker.subscribeTopics(topics);
        this.eventBroker.receiveEvent((data: EventMessageModel) => {
            this.handleEvents(data);
        });
    }

    private handleEvents(data: EventMessageModel) {
        this.logger.logDebug(`Calling handleEvents with data: ${data}`);
        let topic = data.topic as EventTypeModel;
        let message = JSON.parse(data.message as string);
        this.logger.logInfo(`Event received type: ${topic}, data: ${message}`);
        switch(topic) {
            case EventTypeModel.DELETE_USER: {
                this.handleDeleteUserEvent(message);
                break;
            }
        }
        this.logger.logDebug(`Returning handleEvents`);
    }

    private async handleDeleteUserEvent(userDeletedEventModel: UserDeletedEventModel) {
       this.logger.logDebug(`Calling handleDeleteUserEvent with UserDeletedEventModel: ${userDeletedEventModel}`);
       await this.authenticationService.invalidateAccessTokenForUser(userDeletedEventModel._id);
       this.logger.logDebug(`Returning handleDeleteUserEvent`);
    }
}
