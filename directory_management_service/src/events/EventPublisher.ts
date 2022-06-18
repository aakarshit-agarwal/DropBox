import EventProducer from '@dropbox/common_library/events/EventProducer';
import EventPayloadModel from '@dropbox/common_library/models/events/EventPayloadModel';
import DirectoryCreatedEventModel from '@dropbox/common_library/models/events/DirectoryCreatedEventModel';
import DirectoryUpdatedEventModel from '@dropbox/common_library/models/events/DirectoryUpdatedEventModel';
import DirectoryDeletedEventModel from '@dropbox/common_library/models/events/DirectoryDeletedEventModel';
import EventTypeModel from '@dropbox/common_library/models/events/EventTypeModel';
import DirectoryModel from '@dropbox/common_library/models/data/DirectoryModel';

export default class EventPublisher {
    private eventProducer: EventProducer;

    constructor() {
        this.eventProducer = new EventProducer();
    }

    createDirectory(directoryCreatedEventMessage: DirectoryCreatedEventModel) {
        let eventType = EventTypeModel.CREATE_DIRECTORY;
        let message = JSON.stringify(directoryCreatedEventMessage);
        let newEventMessage = new EventPayloadModel(eventType, message);
        this.eventProducer.sendMessage(newEventMessage, async (error: any, data: any) => {
            if(error) {
                console.log(`Error sending event type: ${eventType}, error: ${error}`);
            } else {
                console.log(`Event sent event type: ${eventType}, status: ${data}`);
            }
        });
    }

    deleteDirectory(id: string) {
        let eventType = EventTypeModel.DELETE_DIRECTORY;
        let directoryDeletedEventMessage: DirectoryDeletedEventModel = {
            _id: id
        };
        let message = JSON.stringify(directoryDeletedEventMessage);
        let newEventMessage = new EventPayloadModel(eventType, message);
        this.eventProducer.sendMessage(newEventMessage, async (error: any, data: any) => {
            if(error) {
                console.log(`Error sending event type: ${eventType}, error: ${error}`);
            } else {
                console.log(`Event sent event type: ${eventType}, status: ${data}`);
            }
        });
    }
    
    updateDirectory(directory: DirectoryModel) {
        let eventType = EventTypeModel.UPDATE_DIRECTORY;
        let directoryUpdatedEventMessage: DirectoryUpdatedEventModel = {
            _id: directory._id,
            files: directory.files,
            directories: directory.directories,
            parentId: directory.parentId,
            userId: directory.userId,
            metadataId: directory.metadataId
        };
        let message = JSON.stringify(directoryUpdatedEventMessage);
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
