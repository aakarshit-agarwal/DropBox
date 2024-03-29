import EventPayloadModel from '@dropbox/common_library/models/events/EventPayloadModel';
import FileAddedEventModel from '@dropbox/common_library/models/events/FileAddedEventModel';
import FileDeletedEventModel from '@dropbox/common_library/models/events/FileDeletedEventModel';
import EventTypeModel from '@dropbox/common_library/models/events/EventTypeModel';
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

    addedFile(filesAddedEventMessage: FileAddedEventModel) {
        this.logger.logInfo(`Calling addedFiles with filesAddedEventMessage: ${filesAddedEventMessage}`);
        let eventType = EventTypeModel.ADDED_FILES;
        this.sendEvent(eventType, filesAddedEventMessage);
        this.logger.logInfo(`Returning addedFiles`);

    }

    deletedFile(fileDeletedEventMessage: FileDeletedEventModel) {
        this.logger.logInfo(`Calling deletedFile with fileDeletedEventMessage: ${fileDeletedEventMessage}`);
        let eventType = EventTypeModel.DELETED_FILES;
        this.sendEvent(eventType, fileDeletedEventMessage);
        this.logger.logInfo(`Returning deleteMetadata`);
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
