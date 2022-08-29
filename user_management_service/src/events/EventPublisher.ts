import EventMessageModel from '@dropbox/common_library/models/events/EventMessageModel';
import UserCreatedEventModel from '@dropbox/common_library/models/events/UserCreatedEventModel';
import UserDeletedEventModel from '@dropbox/common_library/models/events/UserDeletedEventModel';
import EventTypeModel from '@dropbox/common_library/models/events/EventTypeModel';
import UserModel from '@dropbox/common_library/models/data/UserModel';
import Logging from "@dropbox/common_library/logging/Logging";
import Kafka from '@dropbox/common_library/components/messageBroker/Kafka';

export default class EventPublisher {
    private logger: Logging;
    private eventBroker: Kafka;

    constructor(logger: Logging, broker: Kafka) {
        this.logger = logger;
        this.eventBroker = broker;
    }

    private sendEvent(eventType: EventTypeModel, eventMessage: any) {
        let message = JSON.stringify(eventMessage);
        let newEventMessage = new EventMessageModel(eventType, message);
        this.eventBroker.sendEvent(newEventMessage);
    }
    
    createUser(user: UserModel) {
        this.logger.logDebug(`Calling sendEvent.createUser with user: ${user}`);
        let eventType = EventTypeModel.CREATE_USER;
        let userCreatedEventMessage = new UserCreatedEventModel(user._id, user.username, user.name);
        this.sendEvent(eventType, userCreatedEventMessage);
        this.logger.logDebug(`Returning sendEvent.createUser`);
    }

    updateUser() {
        this.logger.logDebug(`Calling sendEvent.updateUser`);
        this.logger.logDebug(`Returning sendEvent.updateUser`);
    }

    deleteUser(id: string) {
        this.logger.logDebug(`Calling sendEvent.deleteUser with id: ${id}`);
        let eventType = EventTypeModel.DELETE_USER;
        let userDeletedEventMessage = new UserDeletedEventModel(id);
        this.sendEvent(eventType, userDeletedEventMessage);
        this.logger.logDebug(`Returning sendEvent.deleteUser`);
    }
}
