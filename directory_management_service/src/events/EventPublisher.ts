import DirectoryCreatedEventModel from '@dropbox/common_library/models/events/DirectoryCreatedEventModel';
import DirectoryUpdatedEventModel from '@dropbox/common_library/models/events/DirectoryUpdatedEventModel';
import DirectoryDeletedEventModel from '@dropbox/common_library/models/events/DirectoryDeletedEventModel';
import EventTypeModel from '@dropbox/common_library/models/events/EventTypeModel';
import DirectoryModel from '@dropbox/common_library/models/data/DirectoryModel';
import Logging from '@dropbox/common_library/logging/Logging';
import Kafka from '@dropbox/common_library/components/messageBroker/Kafka';
import EventMessageModel from '@dropbox/common_library/models/events/EventMessageModel';

export default class EventPublisher {
    private logger: Logging;
    private eventBroker: Kafka;

    constructor(logger: Logging, broker: Kafka) {
        this.logger = logger;
        this.eventBroker = broker;
    }

    private sendEvent(eventType: EventTypeModel, eventMessage: any) {
        let message = JSON.stringify(eventMessage);
        let newEventMessage = new EventMessageModel(eventType, message);
        this.eventBroker.sendEvent(newEventMessage);
    }
    
    createDirectory(directory: DirectoryModel, directoryName: string) {
        this.logger.logDebug(`Calling createDirectory with directory: ${directory}, directoryName: ${directoryName}`);
        let eventType = EventTypeModel.CREATE_DIRECTORY;
        let directoryCreatedEventMessage: DirectoryCreatedEventModel = {
            _id: directory._id,
            name: directoryName,
            parentId: directory.parentId,
            owner: directory.owner,
            type: directory.type,
            uploadedOn: new Date(),
            uploadedBy: directory.owner
        }
        this.sendEvent(eventType, directoryCreatedEventMessage);
        this.logger.logDebug(`Returning createDirectory`);
    }

    deleteDirectory(directory: DirectoryModel) {
        this.logger.logDebug(`Calling deleteDirectory with id: ${directory._id}`);
        let eventType = EventTypeModel.DELETE_DIRECTORY;
        let directoryDeletedEventMessage: DirectoryDeletedEventModel = {
            _id: directory._id,
            files: directory.files,
            directories: directory.directories,
            parentId: directory.parentId,
            owner: directory.owner,
            type: directory.type,
            metadataId: directory.metadataId
        };
        this.sendEvent(eventType, directoryDeletedEventMessage);
        this.logger.logDebug(`Returning deleteDirectory`);
    }
    
    updateDirectory(directory: DirectoryModel) {
        this.logger.logDebug(`Calling updateDirectory with directory: ${directory}`);
        let eventType = EventTypeModel.UPDATE_DIRECTORY;
        let directoryUpdatedEventMessage: DirectoryUpdatedEventModel = {
            _id: directory._id,
            files: directory.files,
            directories: directory.directories,
            parentId: directory.parentId,
            owner: directory.owner,
            type: directory.type,
            metadataId: directory.metadataId
        };
        this.sendEvent(eventType, directoryUpdatedEventMessage);
        this.logger.logDebug(`Returning updateDirectory`);
    }

}
