import EventMessageModel from '@dropbox/common_library/models/events/EventMessageModel';
import EventTypeModel from '@dropbox/common_library/models/events/EventTypeModel';
import Kafka from '@dropbox/common_library/components/messageBroker/Kafka';
import UserCreatedEventModel from '@dropbox/common_library/models/events/UserCreatedEventModel';
import UserDeletedEventModel from '@dropbox/common_library/models/events/UserDeletedEventModel';
import CreateDirectoryRequestModel from "@dropbox/common_library/models/dto/CreateDirectoryRequestModel";
import ListDirectoriesRequestModel from "@dropbox/common_library/models/dto/ListDirectoriesRequestModel";
import Logging from '@dropbox/common_library/logging/Logging';
import DirectoryService from './../service/DirectoryService';
import DirectoryDeletedEventModel from '@dropbox/common_library/models/events/DirectoryDeletedEventModel';
import AuthDataModel from '@dropbox/common_library/models/data/AuthDataModel';
import DirectoryTypeModel from '@dropbox/common_library/models/data/DirectoryTypeModel';

export default class EventReceiver {
    private logger: Logging;
    private eventBroker: Kafka;
    private directoryService: DirectoryService

    constructor(logger: Logging, broker: Kafka, directoryService: DirectoryService) {
        this.logger = logger;
        this.eventBroker = broker;
        this.directoryService = directoryService;
    }

    public async startListening() {
        this.logger.logInfo(`Initializing event receiver`);
        let topics: string[] = [EventTypeModel.CREATE_USER, EventTypeModel.DELETE_USER, EventTypeModel.DELETE_DIRECTORY];
        this.logger.logInfo(`Topics: ${topics}`);
        await this.eventBroker.subscribeTopics(topics);
        this.eventBroker.receiveEvent((data: EventMessageModel) => {
            this.handleEvents(data);
        });
    }

    private handleEvents(data: EventMessageModel) {
        this.logger.logDebug(`Calling handleEvents with data: ${data}`);
        let topic = data.topic as EventTypeModel;
        let message = JSON.parse(data.message as string);
        this.logger.logInfo(`Event received type: ${topic}, data: ${message}`);
        switch(topic) {
            case EventTypeModel.DELETE_DIRECTORY: {
                this.handleDeletedDirectoryEvent(message);
                break;
            }
            case EventTypeModel.CREATE_USER: {
                this.handleCreatedUserEvent(message);
                break;
            }
            case EventTypeModel.DELETE_USER: {
                this.handleDeletedUserEvent(message);
                break;
            }
        }
        this.logger.logDebug(`Returning handleEvents`);
    }

    private handleDeletedDirectoryEvent(directoryDeletedEventData: DirectoryDeletedEventModel) {
        this.logger.logDebug(`Calling handleDeletedDirectoryEvent with directoryDeletedEventData: ${directoryDeletedEventData}`);
        let childDirecotries = directoryDeletedEventData.directories;
        childDirecotries.forEach(directoryId => {
            this.directoryService.deleteDirectory(directoryId, this.getAuthData(directoryDeletedEventData.owner));
        });
        this.logger.logDebug(`Returning handleDeletedDirectoryEvent`);
    }

    private handleCreatedUserEvent(userCreatedEventData: UserCreatedEventModel) {
        this.logger.logDebug(`Calling handleCreatedUserEvent with userCreatedEventData: ${userCreatedEventData}`);
        let createDirectoryRequestModel = new CreateDirectoryRequestModel("/", "/", DirectoryTypeModel.ROOT);
        this.directoryService.createDirectory(createDirectoryRequestModel, this.getAuthData(userCreatedEventData._id));
        this.logger.logDebug(`Returning handleCreatedUserEvent`);
    }

    private async handleDeletedUserEvent(userDeletedEventData: UserDeletedEventModel) {
        this.logger.logDebug(`Calling handleDeletedUserEvent with userDeletedEventData: ${userDeletedEventData}`);
        let listDirectoriesRequest = new ListDirectoriesRequestModel('/', DirectoryTypeModel.ROOT);
        let rootDirectory = (await this.directoryService.listDirectories(listDirectoriesRequest, this.getAuthData(userDeletedEventData._id))).at(0);
        this.directoryService.deleteDirectory(rootDirectory!._id, this.getAuthData(userDeletedEventData._id));
        this.logger.logDebug(`Returning handleDeletedUserEvent`);
    }

    private getAuthData(userId: string) {
        return {
            access_token: process.env.DIRECTORY_MANAGEMENT_SERVICE_NAME,
            jwtPayload: {
                id: userId
            }
        } as AuthDataModel;
    }
}
