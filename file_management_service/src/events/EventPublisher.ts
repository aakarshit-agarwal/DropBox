import EventProducer from '@dropbox/common_library/events/EventProducer';
import EventPayloadModel from '@dropbox/common_library/models/events/EventPayloadModel';
import FileAddedEventModel from '@dropbox/common_library/models/events/FileAddedEventModel';
import FileDeletedEventModel from '@dropbox/common_library/models/events/FileDeletedEventModel';
import EventTypeModel from '@dropbox/common_library/models/events/EventTypeModel';
import Logger from './../logger/Logger';

export default class EventPublisher {
    private eventProducer: EventProducer;

    constructor() {
        this.eventProducer = new EventProducer();
    }

    addedFile(filesAddedEventMessage: FileAddedEventModel) {
        Logger.logInfo(`Calling addedFiles with filesAddedEventMessage: ${filesAddedEventMessage}`);
        let eventType = EventTypeModel.ADDED_FILES;
        this.sendEvent(eventType, filesAddedEventMessage);
        Logger.logInfo(`Returning addedFiles`);

    }

    deletedFile(fileDeletedEventMessage: FileDeletedEventModel) {
        Logger.logInfo(`Calling deletedFile with fileDeletedEventMessage: ${fileDeletedEventMessage}`);
        let eventType = EventTypeModel.DELETED_FILES;
        this.sendEvent(eventType, fileDeletedEventMessage);
        Logger.logInfo(`Returning deleteMetadata`);
    }

    private sendEvent(eventType: EventTypeModel, eventMessage: any) {
        let message = JSON.stringify(eventMessage);
        let newEventMessage = new EventPayloadModel(eventType, message);
        this.eventProducer.sendMessage(newEventMessage, async (error: any, data: any) => {
            if(error) {
                console.log(`Error sending event type: ${eventType}, error: ${error}`);
            } else {
                console.log(`Event sent event type: ${eventType}, status: ${data}`);
            }
        });
    }
}
