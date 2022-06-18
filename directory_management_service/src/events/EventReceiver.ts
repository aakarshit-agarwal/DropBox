import EventConsumer from '@dropbox/common_library/events/EventConsumer';
import EventMessageModel from '@dropbox/common_library/models/events/EventMessageModel';
import EventTypeModel from '@dropbox/common_library/models/events/EventTypeModel';
import UserCreatedEventModel from '@dropbox/common_library/models/events/UserCreatedEventModel';
import UserDeletedEventModel from '@dropbox/common_library/models/events/UserDeletedEventModel';
import DirectoryService from './../service/DirectoryService';
import CreateDirectoryRequestModel from "@dropbox/common_library/models/dto/CreateDirectoryRequestModel";
import ListDirectoriesRequestModel from "@dropbox/common_library/models/dto/ListDirectoriesRequestModel";

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
        console.log(`Event received type: ${data.topic}, data: ${data.value}`);
        let topic = data.topic as EventTypeModel;
        let message = JSON.parse(data.value as string);
        switch(topic) {
            case EventTypeModel.CREATE_DIRECTORY: {
                this.handleCreatedUserEvent(message);
                break;
            }
            case EventTypeModel.DELETE_DIRECTORY: {
                this.handleDeletedUserEvent(message);
                break;
            }
        }
    }

    private handleCreatedUserEvent(userCreatedEventData: UserCreatedEventModel) {
        let createDirectoryRequestModel = new CreateDirectoryRequestModel("/", "/");
        this.directoryService.createDirectory(createDirectoryRequestModel, userCreatedEventData._id);
    }

    private async handleDeletedUserEvent(userDeletedEventData: UserDeletedEventModel) {
        let listDirectoriesRequest = new ListDirectoriesRequestModel('/')
        let rootDirectory = (await this.directoryService.listDirectories(listDirectoriesRequest, userDeletedEventData._id)).at(0);
        this.directoryService.deleteDirectory(rootDirectory!._id);
    }
}
