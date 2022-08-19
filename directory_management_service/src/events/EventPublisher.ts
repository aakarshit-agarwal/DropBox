import EventProducer from '@dropbox/common_library/events/EventProducer';
import EventPayloadModel from '@dropbox/common_library/models/events/EventPayloadModel';
import DirectoryCreatedEventModel from '@dropbox/common_library/models/events/DirectoryCreatedEventModel';
import DirectoryUpdatedEventModel from '@dropbox/common_library/models/events/DirectoryUpdatedEventModel';
import DirectoryDeletedEventModel from '@dropbox/common_library/models/events/DirectoryDeletedEventModel';
import EventTypeModel from '@dropbox/common_library/models/events/EventTypeModel';
import DirectoryModel from '@dropbox/common_library/models/data/DirectoryModel';
import Logger from './../logger/Logger';

export default class EventPublisher {
    private eventProducer: EventProducer;

    constructor() {
        this.eventProducer = new EventProducer();
    }

    createDirectory(directoryCreatedEventMessage: DirectoryCreatedEventModel) {
        Logger.logInfo(`Calling createDirectory with directoryCreatedEventMessage: ${directoryCreatedEventMessage}`);
        let eventType = EventTypeModel.CREATE_DIRECTORY;
        this.sendEvent(eventType, directoryCreatedEventMessage);
        Logger.logInfo(`Returning createDirectory`);
    }

    deleteDirectory(id: string, userId: string) {
        Logger.logInfo(`Calling deleteDirectory with id: ${id}`);
        let eventType = EventTypeModel.DELETE_DIRECTORY;
        let directoryDeletedEventMessage: DirectoryDeletedEventModel = {
            _id: id,
            userId: userId
        };
        this.sendEvent(eventType, directoryDeletedEventMessage);
        Logger.logInfo(`Returning deleteDirectory`);
    }
    
    updateDirectory(directory: DirectoryModel) {
        Logger.logInfo(`Calling updateDirectory with directory: ${directory}`);
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
        Logger.logInfo(`Returning updateDirectory`);
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
