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

    createUser(user: UserModel) {
        this.logger.logInfo(`Calling createUser with user: ${user}`);
        let eventType = EventTypeModel.CREATE_USER;
        let userCreatedEventMessage = new UserCreatedEventModel(user._id, user.username, user.name);
        let message = JSON.stringify(userCreatedEventMessage);
        let newEventMessage = new EventPayloadModel(eventType, message);
        this.eventPublisher.sendMessage(newEventMessage, async (error: any, data: any) => {
            if(error) {
                console.log(`Error sending event type: ${eventType}, error: ${error}`);
            } else {
                console.log(`Event sent event type: ${eventType}, status: ${data}`);
            }
        });
        this.logger.logInfo(`Returning createUser`);
    }

    updateUser() {
        this.logger.logInfo(`Calling updateUser`);
        this.logger.logInfo(`Returning updateUser`);
    }

    deleteUser(id: string) {
        this.logger.logInfo(`Calling deleteUser with id: ${id}`);
        let eventType = EventTypeModel.DELETE_USER;
        let userDeletedEventMessage = new UserDeletedEventModel(id);
        let message = JSON.stringify(userDeletedEventMessage);
        let newEventMessage = new EventPayloadModel(eventType, message);
        this.eventPublisher.sendMessage(newEventMessage, async (error: any, data: any) => {
            if(error) {
                console.log(`Error sending event type: ${eventType}, error: ${error}`);
            } else {
                console.log(`Event sent event type: ${eventType}, status: ${data}`);
            }
        });
        this.logger.logInfo(`Returning deleteUser`);
    }
}
