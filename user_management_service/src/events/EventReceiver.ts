import EventMessageModel from '@dropbox/common_library/models/events/EventMessageModel';
import EventTypeModel from '@dropbox/common_library/models/events/EventTypeModel';
import Kafka from '@dropbox/common_library/components/messageBroker/Kafka';
import Logging, {LogMethodArgsAndReturn} from '@dropbox/common_library/logging/Logging';
import UserService from './../service/UserService';
import AuthDataModel from '@dropbox/common_library/models/data/AuthDataModel';
import UserDeletedEventModel from '@dropbox/common_library/models/events/UserDeletedEventModel';

export default class EventReceiver {
    private logger: Logging;
    private eventBroker: Kafka;
    private userService: UserService

    constructor(logger: Logging, broker: Kafka, userService: UserService) {
        this.logger = logger;
        this.eventBroker = broker;
        this.userService = userService;
    }

    public async startListening() {
        this.logger.logInfo(`Initializing event receiver`);
        // let topics = [];
        // this.eventBroker.subscribeTopics(topics);
        this.eventBroker.receiveEvent((data: EventMessageModel) => {
            this.handleEvents(data);
        });
    }

    @LogMethodArgsAndReturn
    private handleEvents(data: EventMessageModel) {
        let topic = data.topic as EventTypeModel;
        let message = JSON.parse(data.message as string);
        this.logger.logInfo(`Event received type: ${topic}, data: ${message}`);
        switch(topic) {
            case EventTypeModel.DELETE_USER: {
                this.handleDeletedUserEvent(message);
                break;
            }
        }
    }

    @LogMethodArgsAndReturn
    private handleDeletedUserEvent(userDeletedEventData: UserDeletedEventModel) {
        this.userService;
        this.getAuthData(userDeletedEventData._id);
    }

    private getAuthData(userId: string) {
        return {
            access_token: process.env.USER_MANAGEMENT_SERVICE_NAME,
            jwtPayload: {
                id: userId
            }
        } as AuthDataModel;
    }
}
