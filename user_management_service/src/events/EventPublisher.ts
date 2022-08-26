import EventPayloadModel from '@dropbox/common_library/models/events/EventPayloadModel';
import UserCreatedEventModel from '@dropbox/common_library/models/events/UserCreatedEventModel';
import UserDeletedEventModel from '@dropbox/common_library/models/events/UserDeletedEventModel';
import EventTypeModel from '@dropbox/common_library/models/events/EventTypeModel';
import UserModel from '@dropbox/common_library/models/data/UserModel';
import Logging from "@dropbox/common_library/logging/Logging";
import Kafka, {Publisher} from '@dropbox/common_library/components/messageBroker/Kafka';

export default class EventPublisher {
    private logger: Logging;
    private broker: Kafka;
    private eventPublisher: Publisher;

    constructor(logger: Logging, broker: Kafka) {
        this.logger = logger;
        this.broker = broker;

        this.eventPublisher = this.broker.initializePublisher();
    }

    private sendEvent(eventType: EventTypeModel, eventMessage: any) {
        let message = JSON.stringify(eventMessage);
        let newEventMessage = new EventPayloadModel(eventType, message);
        this.eventPublisher.sendMessage(newEventMessage, async (error: any, _data: any) => {
            if(error) {
                this.logger.logError(`Error sending event type: ${eventType}, error: ${error}`);
            } else {
                this.logger.logInfo(`Event sent event type: ${eventType}`);
                console.log();
            }
        });
    }

    createUser(user: UserModel) {
        this.logger.logDebug(`Calling createUser with user: ${user}`);
        let eventType = EventTypeModel.CREATE_USER;
        let userCreatedEventMessage = new UserCreatedEventModel(user._id, user.username, user.name);
        this.sendEvent(eventType, userCreatedEventMessage);
        this.logger.logDebug(`Returning createUser`);
    }

    updateUser() {
        this.logger.logDebug(`Calling updateUser`);
        this.logger.logDebug(`Returning updateUser`);
    }

    deleteUser(id: string) {
        this.logger.logDebug(`Calling deleteUser with id: ${id}`);
        let eventType = EventTypeModel.DELETE_USER;
        let userDeletedEventMessage = new UserDeletedEventModel(id);
        this.sendEvent(eventType, userDeletedEventMessage);
        this.logger.logDebug(`Returning deleteUser`);
    }
}
