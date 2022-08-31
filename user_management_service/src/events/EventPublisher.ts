import EventMessageModel from '@dropbox/common_library/models/events/EventMessageModel';
import UserCreatedEventModel from '@dropbox/common_library/models/events/UserCreatedEventModel';
import UserDeletedEventModel from '@dropbox/common_library/models/events/UserDeletedEventModel';
import EventTypeModel from '@dropbox/common_library/models/events/EventTypeModel';
import UserModel from '@dropbox/common_library/models/data/UserModel';
import Logging, {LogMethodArgsAndReturn} from "@dropbox/common_library/logging/Logging";
import Kafka from '@dropbox/common_library/components/messageBroker/Kafka';
import {inject, injectable} from "inversify";
import "reflect-metadata";
import TYPES from './../types';

@injectable()
export default class EventPublisher {
    private logger: Logging;
    private eventBroker: Kafka;

    constructor(
        @inject(TYPES.Logger) logger: Logging, 
        @inject(TYPES.MessageBroker) broker: Kafka
    ) {
        this.logger = logger;
        this.eventBroker = broker;
    }

    @LogMethodArgsAndReturn
    private sendEvent(eventType: EventTypeModel, eventMessage: any) {
        let message = JSON.stringify(eventMessage);
        let newEventMessage = new EventMessageModel(eventType, message);
        this.eventBroker.sendEvent(newEventMessage);
    }
    
    @LogMethodArgsAndReturn
    createUser(user: UserModel) {
        let eventType = EventTypeModel.CREATE_USER;
        let userCreatedEventMessage = new UserCreatedEventModel(user._id, user.username, user.name);
        this.sendEvent(eventType, userCreatedEventMessage);
    }

    @LogMethodArgsAndReturn
    updateUser() {
    }

    @LogMethodArgsAndReturn
    deleteUser(id: string) {
        let eventType = EventTypeModel.DELETE_USER;
        let userDeletedEventMessage = new UserDeletedEventModel(id);
        this.sendEvent(eventType, userDeletedEventMessage);
    }
}
