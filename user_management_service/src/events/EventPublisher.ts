import EventProducer from '@dropbox/common_library/events/EventProducer';
import EventPayloadModel from '@dropbox/common_library/models/events/EventPayloadModel';
import UserCreatedEventModel from '@dropbox/common_library/models/events/UserCreatedEventModel';
import UserDeletedEventModel from '@dropbox/common_library/models/events/UserDeletedEventModel';
import EventTypeModel from '@dropbox/common_library/models/events/EventTypeModel';
import UserModel from '@dropbox/common_library/models/data/UserModel';

export default class EventPublisher {
    private eventProducer: EventProducer;

    constructor() {
        this.eventProducer = new EventProducer();
    }

    createUser(user: UserModel) {
        let eventType = EventTypeModel.CREATE_USER;
        let userCreatedEventMessage = new UserCreatedEventModel(user._id, user.username, user.name);
        let message = JSON.stringify(userCreatedEventMessage);
        let newEventMessage = new EventPayloadModel(eventType, message);
        this.eventProducer.sendMessage(newEventMessage, async (error: any, data: any) => {
            if(error) {
                console.log(`Error sending event type: ${eventType}, error: ${error}`);
            } else {
                console.log(`Event sent event type: ${eventType}, status: ${data}`);
            }
        });
    }

    updateUser() {

    }

    deleteUser(id: string) {
        let eventType = EventTypeModel.DELETE_USER;
        let userDeletedEventMessage = new UserDeletedEventModel(id);
        let message = JSON.stringify(userDeletedEventMessage);
        let newEventMessage = new EventPayloadModel(eventType, message);
        this.eventProducer.sendMessage(newEventMessage, async (error: any, data: any) => {
            if(error) {
                console.log(`Error sending event type: ${eventType}, error: ${error}`);
            } else {
                console.log(`Event sent event type: ${eventType}, status: ${data}`);
            }
        });
    }
}
