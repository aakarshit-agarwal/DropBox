import EventProducer from '@dropbox/common_library/events/EventProducer';
import EventPayloadModel from '@dropbox/common_library/models/events/EventPayloadModel';
import MetadataCreatedEventModel from '@dropbox/common_library/models/events/MetadataCreatedEventModel';
import MetadataUpdatedEventModel from '@dropbox/common_library/models/events/MetadataUpdatedEventModel';
import MetadataDeletedEventModel from '@dropbox/common_library/models/events/MetadataDeletedEventModel';
import EventTypeModel from '@dropbox/common_library/models/events/EventTypeModel';
import MetadataModel from '@dropbox/common_library/models/data/MetadataModel';

export default class EventPublisher {
    private eventProducer: EventProducer;

    constructor() {
        this.eventProducer = new EventProducer();
    }

    createMetadata(metadata: MetadataModel) {
        let eventType = EventTypeModel.CREATE_METADATA;
        let metadataCreatedEventMessage = new MetadataCreatedEventModel(metadata._id, metadata.resourceType, 
            metadata.name, metadata.resourceId, metadata.resourceHash, metadata.uploadedOn, 
            metadata.uploadedBy, metadata.lastAccessedOn, metadata.lastAccessedBy);
        let message = JSON.stringify(metadataCreatedEventMessage);
        let newEventMessage = new EventPayloadModel(eventType, message);
        this.eventProducer.sendMessage(newEventMessage, async (error: any, data: any) => {
            if(error) {
                console.log(`Error sending event type: ${eventType}, error: ${error}`);
            } else {
                console.log(`Event sent event type: ${eventType}, status: ${data}`);
                console.log(data);
            }
        });
    }

    updateMetadata(metadata: MetadataModel) {
        let eventType = EventTypeModel.UPDATE_METADATA;
        let metadatUpdatedEventMessage = new MetadataUpdatedEventModel(metadata._id, metadata.resourceType, 
            metadata.name, metadata.resourceId, metadata.resourceHash, metadata.uploadedOn, 
            metadata.uploadedBy, metadata.lastAccessedOn, metadata.lastAccessedBy);
        let message = JSON.stringify(metadatUpdatedEventMessage);
        let newEventMessage = new EventPayloadModel(eventType, message);
        this.eventProducer.sendMessage(newEventMessage, async (error: any, data: any) => {
            if(error) {
                console.log(`Error sending event type: ${eventType}, error: ${error}`);
            } else {
                console.log(`Event sent event type: ${eventType}, status: ${data}`);
            }
        });
    }

    deleteMetadata(id: string) {
        let eventType = EventTypeModel.DELETE_METADATA;
        let metadataDeletedEventMessage = new MetadataDeletedEventModel(id);
        let message = JSON.stringify(metadataDeletedEventMessage);
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
