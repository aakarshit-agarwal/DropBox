import EventMessageModel from '@dropbox/common_library/models/events/EventMessageModel';
import EventTypeModel from '@dropbox/common_library/models/events/EventTypeModel';
import Kafka, { Receiver } from '@dropbox/common_library/components/messageBroker/Kafka';
import UserCreatedEventModel from '@dropbox/common_library/models/events/UserCreatedEventModel';
import UserDeletedEventModel from '@dropbox/common_library/models/events/UserDeletedEventModel';
import DirectoryService from './../service/DirectoryService';
import CreateDirectoryRequestModel from "@dropbox/common_library/models/dto/CreateDirectoryRequestModel";
import ListDirectoriesRequestModel from "@dropbox/common_library/models/dto/ListDirectoriesRequestModel";
import Logging from '@dropbox/common_library/logging/Logging';

export default class EventReceiver {
    private logger: Logging;
    private broker: Kafka;
    private directoryService: DirectoryService;
    private eventReceiver: Receiver;

    constructor(logger: Logging, broker: Kafka, directoryService: DirectoryService) {
        this.logger = logger;
        this.broker = broker;
        this.directoryService = directoryService;

        let topics = [EventTypeModel.CREATE_USER, EventTypeModel.DELETE_USER];
        this.eventReceiver = this.broker.initializeReceiver(topics);
    }

    public startListening() {
        this.eventReceiver.receiveMessage((data: EventMessageModel) => {
            this.handleEvents(data);
        });
    }

    private handleEvents(data: EventMessageModel) {
        this.logger.logInfo(`Calling handleEvents with data: ${data}`);
        console.log(`Event received type: ${data.topic}, data: ${data.value}`);
        let topic = data.topic as EventTypeModel;
        let message = JSON.parse(data.value as string);
        switch(topic) {
            case EventTypeModel.CREATE_USER: {
                this.handleCreatedUserEvent(message);
                break;
            }
            case EventTypeModel.DELETE_USER: {
                this.handleDeletedUserEvent(message);
                break;
            }
        }
        this.logger.logInfo(`Returning handleEvents`);
    }

    private handleCreatedUserEvent(userCreatedEventData: UserCreatedEventModel) {
        this.logger.logInfo(`Calling handleCreatedUserEvent with userCreatedEventData: ${userCreatedEventData}`);
        let createDirectoryRequestModel = new CreateDirectoryRequestModel("/", "/");
        this.directoryService.createDirectory(createDirectoryRequestModel, userCreatedEventData._id);
        this.logger.logInfo(`Returning handleCreatedUserEvent`);
    }

    private async handleDeletedUserEvent(userDeletedEventData: UserDeletedEventModel) {
        this.logger.logInfo(`Calling handleDeletedUserEvent with userDeletedEventData: ${userDeletedEventData}`);
        let listDirectoriesRequest = new ListDirectoriesRequestModel('/')
        let rootDirectory = (await this.directoryService.listDirectories(listDirectoriesRequest, userDeletedEventData._id)).at(0);
        this.directoryService.deleteDirectory(rootDirectory!._id);
        this.logger.logInfo(`Returning handleDeletedUserEvent`);
    }
}
