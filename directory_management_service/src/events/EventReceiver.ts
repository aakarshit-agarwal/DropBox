import EventConsumer from '@dropbox/common_library/events/EventConsumer';
import EventMessageModel from '@dropbox/common_library/models/events/EventMessageModel';
import EventTypeModel from '@dropbox/common_library/models/events/EventTypeModel';
import UserCreatedEventModel from '@dropbox/common_library/models/events/UserCreatedEventModel';
import UserDeletedEventModel from '@dropbox/common_library/models/events/UserDeletedEventModel';
import DirectoryService from './../service/DirectoryService';
import CreateDirectoryRequestModel from "@dropbox/common_library/models/dto/CreateDirectoryRequestModel";
import ListDirectoriesRequestModel from "@dropbox/common_library/models/dto/ListDirectoriesRequestModel";
import Logger from './../logger/Logger';

export default class EventReceiver {
    private topics: EventTypeModel[];
    private eventConsumer: EventConsumer;
    private directoryService: DirectoryService;

    constructor() {
        this.topics = [EventTypeModel.CREATE_USER, EventTypeModel.DELETE_USER];
        this.eventConsumer = new EventConsumer(this.topics);
        this.directoryService = new DirectoryService();
    }

    public startListening() {
        this.eventConsumer.receiveMessage((data: EventMessageModel) => {
            this.handleEvents(data);
        });
    }

    private handleEvents(data: EventMessageModel) {
        Logger.logInfo(`Calling handleEvents with data: ${data}`);
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
        Logger.logInfo(`Returning handleEvents`);
    }

    private handleCreatedUserEvent(userCreatedEventData: UserCreatedEventModel) {
        Logger.logInfo(`Calling handleCreatedUserEvent with userCreatedEventData: ${userCreatedEventData}`);
        let createDirectoryRequestModel = new CreateDirectoryRequestModel("/", "/");
        this.directoryService.createDirectory(createDirectoryRequestModel, userCreatedEventData._id);
        Logger.logInfo(`Returning handleCreatedUserEvent`);
    }

    private async handleDeletedUserEvent(userDeletedEventData: UserDeletedEventModel) {
        Logger.logInfo(`Calling handleDeletedUserEvent with userDeletedEventData: ${userDeletedEventData}`);
        let listDirectoriesRequest = new ListDirectoriesRequestModel('/')
        let rootDirectory = (await this.directoryService.listDirectories(listDirectoriesRequest, userDeletedEventData._id)).at(0);
        this.directoryService.deleteDirectory(rootDirectory!._id);
        Logger.logInfo(`Returning handleDeletedUserEvent`);
    }
}
