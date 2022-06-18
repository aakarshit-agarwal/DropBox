import EventConsumer from '@dropbox/common_library/events/EventConsumer';
import EventMessageModel from '@dropbox/common_library/models/events/EventMessageModel';
import EventTypeModel from '@dropbox/common_library/models/events/EventTypeModel';
import DirectoryCreatedEventModel from '@dropbox/common_library/models/events/DirectoryCreatedEventModel';
import DirectoryDeletedEventModel from '@dropbox/common_library/models/events/DirectoryDeletedEventModel';
import CreateMetadataRequestModel from '@dropbox/common_library/models/dto/CreateMetadataRequestModel';
import ResourceTypeModel from '@dropbox/common_library/models/data/ResourceTypeModel';
import MetadataService from './../service/MetadataService';
import MetadataModel from '@dropbox/common_library/models/data/MetadataModel';
import Logger from './../logger/Logger';

export default class EventReceiver {
    private topics: EventTypeModel[];
    private eventConsumer: EventConsumer;
    private metadataService: MetadataService;

    constructor() {
        this.topics = [EventTypeModel.CREATE_DIRECTORY, EventTypeModel.DELETE_DIRECTORY];
        this.eventConsumer = new EventConsumer(this.topics);
        this.metadataService = new MetadataService();
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
            case EventTypeModel.CREATE_DIRECTORY: {
                this.handleCreatedDirectoryEvent(message);
                break;
            }
            case EventTypeModel.DELETE_DIRECTORY: {
                this.handleDeletedDirectoryEvent(message);
                break;
            }
        }
        Logger.logInfo(`Returning handleEvents`);
    }

    private handleCreatedDirectoryEvent(directoryCreatedEventData: DirectoryCreatedEventModel) {
        Logger.logInfo(`Calling handleCreatedDirectoryEvent with directoryCreatedEventData: ${directoryCreatedEventData}`);
        let createMetadataRequest: CreateMetadataRequestModel = {
            resourceType: ResourceTypeModel.FOLDER,
            name: directoryCreatedEventData.name,
            resourceId: directoryCreatedEventData._id,
            resourceHash: directoryCreatedEventData.resourceHash,
            uploadedOn: directoryCreatedEventData.uploadedOn,
            uploadedBy: directoryCreatedEventData.uploadedBy
        };
        this.metadataService.createMetadata(createMetadataRequest);
        Logger.logInfo(`Returning handleCreatedDirectoryEvent`);
    }

    private async handleDeletedDirectoryEvent(directoryDeletedEventData: DirectoryDeletedEventModel) {
        Logger.logInfo(`Calling handleDeletedDirectoryEvent with directoryDeletedEventData: ${directoryDeletedEventData}`);
        let metadata: MetadataModel = await this.metadataService.getMetadataByResourceId(directoryDeletedEventData._id);
        this.metadataService.deleteMetadata(metadata._id);
        Logger.logInfo(`Returning handleDeletedDirectoryEvent`);
    }
}
