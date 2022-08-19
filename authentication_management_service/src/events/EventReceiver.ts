import EventConsumer from '@dropbox/common_library/events/EventConsumer';
import EventMessageModel from '@dropbox/common_library/models/events/EventMessageModel';
import EventTypeModel from '@dropbox/common_library/models/events/EventTypeModel';
import UserDeletedEventModel from '@dropbox/common_library/models/events/UserDeletedEventModel';
import AuthenticationService from './../service/AuthenticationService';
import Logger from './../logger/Logger';

export default class EventReceiver {
    private topics: EventTypeModel[];
    private eventConsumer: EventConsumer;
    private authenticationService: AuthenticationService;

    constructor() {
        this.topics = [EventTypeModel.DELETE_USER];
        this.eventConsumer = new EventConsumer(this.topics);
        this.authenticationService = new AuthenticationService();
    }

    public startListening() {
        this.eventConsumer.receiveMessage((data: EventMessageModel) => {
            this.handleEvents(data);
        });
    }

    private handleEvents(data: EventMessageModel) {
        Logger.logInfo(`Calling handleEvents with data: ${data}`);
        let topic = data.topic as EventTypeModel;
        let message = JSON.parse(data.value as string);
        switch(topic) {
            case EventTypeModel.DELETE_USER: {
                this.handleDeleteUserEvent(message);
                break;
            }
        }
        Logger.logInfo(`Returning handleEvents`);
    }

    private async handleDeleteUserEvent(userDeletedEventModel: UserDeletedEventModel) {
        Logger.logInfo(`Calling handleDeleteUserEvent with UserDeletedEventModel: ${userDeletedEventModel}`);
        await this.authenticationService.parseAccessTokenAndGetUserId(userDeletedEventModel._id);
        Logger.logInfo(`Returning handleDeleteUserEvent`);
    }
}
