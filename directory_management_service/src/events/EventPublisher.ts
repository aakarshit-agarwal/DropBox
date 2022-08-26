import EventPayloadModel from '@dropbox/common_library/models/events/EventPayloadModel';
import DirectoryCreatedEventModel from '@dropbox/common_library/models/events/DirectoryCreatedEventModel';
import DirectoryUpdatedEventModel from '@dropbox/common_library/models/events/DirectoryUpdatedEventModel';
import DirectoryDeletedEventModel from '@dropbox/common_library/models/events/DirectoryDeletedEventModel';
import EventTypeModel from '@dropbox/common_library/models/events/EventTypeModel';
import DirectoryModel from '@dropbox/common_library/models/data/DirectoryModel';
import Logging from '@dropbox/common_library/logging/Logging';
import Kafka, {Publisher} from '@dropbox/common_library/components/messageBroker/Kafka';

export default class EventPublisher {
    private logger: Logging;
    private broker: Kafka;
    private eventPublisher: Publisher;

    constructor(logger: Logging, broker: Kafka) {
        this.logger = logger;
        this.broker = broker;

        this.eventPublisher = this.broker.initializePublisher();
    }

    createDirectory(directoryCreatedEventMessage: DirectoryCreatedEventModel) {
        this.logger.logInfo(`Calling createDirectory with directoryCreatedEventMessage: ${directoryCreatedEventMessage}`);
        let eventType = EventTypeModel.CREATE_DIRECTORY;
        this.sendEvent(eventType, directoryCreatedEventMessage);
        this.logger.logInfo(`Returning createDirectory`);
    }

    deleteDirectory(id: string, userId: string) {
        this.logger.logInfo(`Calling deleteDirectory with id: ${id}`);
        let eventType = EventTypeModel.DELETE_DIRECTORY;
        let directoryDeletedEventMessage: DirectoryDeletedEventModel = {
            _id: id,
            userId: userId
        };
        this.sendEvent(eventType, directoryDeletedEventMessage);
        this.logger.logInfo(`Returning deleteDirectory`);
    }
    
    updateDirectory(directory: DirectoryModel) {
        this.logger.logInfo(`Calling updateDirectory with directory: ${directory}`);
        let eventType = EventTypeModel.UPDATE_DIRECTORY;
        let directoryUpdatedEventMessage: DirectoryUpdatedEventModel = {
            _id: directory._id,
            files: directory.files,
            directories: directory.directories,
            parentId: directory.parentId,
            userId: directory.userId,
            metadataId: directory.metadataId
        };
        this.sendEvent(eventType, directoryUpdatedEventMessage);
        this.logger.logInfo(`Returning updateDirectory`);
    }

    private sendEvent(eventType: EventTypeModel, eventMessage: any) {
        let message = JSON.stringify(eventMessage);
        let newEventMessage = new EventPayloadModel(eventType, message);
        this.eventPublisher.sendMessage(newEventMessage, async (error: any, data: any) => {
            if(error) {
                console.log(`Error sending event type: ${eventType}, error: ${error}`);
            } else {
                console.log(`Event sent event type: ${eventType}, status: ${data}`);
            }
        });
    }
}
