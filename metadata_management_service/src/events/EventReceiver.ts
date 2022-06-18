import EventConsumer from '@dropbox/common_library/events/EventConsumer';
import EventMessageModel from '@dropbox/common_library/models/events/EventMessageModel';
import EventTypeModel from '@dropbox/common_library/models/events/EventTypeModel';
import DirectoryCreatedEventModel from '@dropbox/common_library/models/events/DirectoryCreatedEventModel';
import DirectoryDeletedEventModel from '@dropbox/common_library/models/events/DirectoryDeletedEventModel';
import CreateMetadataRequestModel from '@dropbox/common_library/models/dto/CreateMetadataRequestModel';
import ResourceTypeModel from '@dropbox/common_library/models/data/ResourceTypeModel';
import MetadataService from './../service/MetadataService';
import MetadataModel from '@dropbox/common_library/models/data/MetadataModel';

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
        console.log(`Event received type: ${data.topic}, data: ${data.value}`);
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
    }

    private handleCreatedDirectoryEvent(directoryCreatedEventData: DirectoryCreatedEventModel) {
        let createMetadataRequest: CreateMetadataRequestModel = {
            resourceType: ResourceTypeModel.FOLDER,
            name: directoryCreatedEventData.name,
            resourceId: directoryCreatedEventData._id,
            resourceHash: directoryCreatedEventData.resourceHash,
            uploadedOn: directoryCreatedEventData.uploadedOn,
            uploadedBy: directoryCreatedEventData.uploadedBy
        };
        this.metadataService.createMetadata(createMetadataRequest);
    }

    private async handleDeletedDirectoryEvent(directoryDeletedEventData: DirectoryDeletedEventModel) {
        let metadata: MetadataModel = await this.metadataService.getMetadataByResourceId(directoryDeletedEventData._id);
        this.metadataService.deleteMetadata(metadata._id);
    }
}
