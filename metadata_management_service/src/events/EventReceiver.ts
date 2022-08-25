import EventConsumer from '@dropbox/common_library/events/EventConsumer';
import EventMessageModel from '@dropbox/common_library/models/events/EventMessageModel';
import EventTypeModel from '@dropbox/common_library/models/events/EventTypeModel';
import DirectoryCreatedEventModel from '@dropbox/common_library/models/events/DirectoryCreatedEventModel';
import DirectoryDeletedEventModel from '@dropbox/common_library/models/events/DirectoryDeletedEventModel';
import FileAddedEventModel from '@dropbox/common_library/models/events/FileAddedEventModel';
import FileDeletedEventModel from '@dropbox/common_library/models/events/FileDeletedEventModel';
import CreateMetadataRequestModel from '@dropbox/common_library/models/dto/CreateMetadataRequestModel';
import ResourceTypeModel from '@dropbox/common_library/models/data/ResourceTypeModel';
import MetadataService from './../service/MetadataService';
import MetadataModel from '@dropbox/common_library/models/data/MetadataModel';
import Logging from '@dropbox/common_library/logging/Logging';

export default class EventReceiver {
    private applicationContext: any;
    private logger: Logging;
    private topics: EventTypeModel[];
    private eventConsumer: EventConsumer;
    private metadataService: MetadataService;

    constructor(applicationContext: any) {
        this.applicationContext = applicationContext;
        this.logger = this.applicationContext.logger;
        this.topics = [EventTypeModel.CREATE_DIRECTORY, EventTypeModel.DELETE_DIRECTORY];
        this.eventConsumer = new EventConsumer(this.topics, process.env.KAFKA_HOST!, 
            process.env.KAFKA_PORT! as unknown as number);
        this.metadataService = new MetadataService(this.applicationContext);
    }

    public startListening() {
        this.eventConsumer.receiveMessage((data: EventMessageModel) => {
            this.handleEvents(data);
        });
    }

    private handleEvents(data: EventMessageModel) {
        this.logger.logInfo(`Calling handleEvents with data: ${data}`);
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
            case EventTypeModel.ADDED_FILES: {
                this.handleAddedFilesEvent(message);
                break;
            }
            case EventTypeModel.DELETED_FILES: {
                this.handleDeletedFilesEvent(message);
                break;
            }
        }
        this.logger.logInfo(`Returning handleEvents`);
    }

    private handleCreatedDirectoryEvent(directoryCreatedEventData: DirectoryCreatedEventModel) {
        this.logger.logInfo(`Calling handleCreatedDirectoryEvent with directoryCreatedEventData: ${directoryCreatedEventData}`);
        let createMetadataRequest: CreateMetadataRequestModel = {
            resourceType: ResourceTypeModel.FOLDER,
            name: directoryCreatedEventData.name,
            resourceId: directoryCreatedEventData._id,
            resourceHash: directoryCreatedEventData.resourceHash,
            owner: directoryCreatedEventData.uploadedBy,
            uploadedOn: directoryCreatedEventData.uploadedOn,
            uploadedBy: directoryCreatedEventData.uploadedBy
        };
        this.metadataService.createMetadata(createMetadataRequest);
        this.logger.logInfo(`Returning handleCreatedDirectoryEvent`);
    }

    private async handleDeletedDirectoryEvent(directoryDeletedEventData: DirectoryDeletedEventModel) {
        this.logger.logInfo(`Calling handleDeletedDirectoryEvent with directoryDeletedEventData: ${directoryDeletedEventData}`);
        let metadata: MetadataModel = await this.metadataService.getMetadataByResourceId(directoryDeletedEventData._id);
        this.metadataService.deleteMetadata(metadata._id);
        this.logger.logInfo(`Returning handleDeletedDirectoryEvent`);
    }

    private handleAddedFilesEvent(fileAddedEventData: FileAddedEventModel) {
        this.logger.logInfo(`Calling handleAddedFilesEvent with fileAddedEventData: ${fileAddedEventData}`);
        let createMetadataRequest: CreateMetadataRequestModel = {
            resourceType: ResourceTypeModel.FILE,
            name: fileAddedEventData.name,
            resourceId: fileAddedEventData._id,
            resourceHash: fileAddedEventData.fileHash,
            uploadedOn: fileAddedEventData.addedOn,
            uploadedBy: fileAddedEventData.addedBy,
            owner: fileAddedEventData.owner
        };
        this.metadataService.createMetadata(createMetadataRequest);
        this.logger.logInfo(`Returning handleAddedFilesEvent`);
    }

    private async handleDeletedFilesEvent(fileDeletedEventData: FileDeletedEventModel) {
        this.logger.logInfo(`Calling handleDeletedFilesEvent with fileDeletedEventData: ${fileDeletedEventData}`);
        let metadata: MetadataModel = await this.metadataService.getMetadataByResourceId(fileDeletedEventData._id);
        this.metadataService.deleteMetadata(metadata._id);
        this.logger.logInfo(`Returning handleDeletedFilesEvent`);
    }
}
