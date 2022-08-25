import EventProducer from '@dropbox/common_library/events/EventProducer';
import EventPayloadModel from '@dropbox/common_library/models/events/EventPayloadModel';
import MetadataCreatedEventModel from '@dropbox/common_library/models/events/MetadataCreatedEventModel';
import MetadataUpdatedEventModel from '@dropbox/common_library/models/events/MetadataUpdatedEventModel';
import MetadataDeletedEventModel from '@dropbox/common_library/models/events/MetadataDeletedEventModel';
import EventTypeModel from '@dropbox/common_library/models/events/EventTypeModel';
import MetadataModel from '@dropbox/common_library/models/data/MetadataModel';
import Logging from '@dropbox/common_library/logging/Logging';

export default class EventPublisher {
    private applicationContext: any;
    private logger: Logging;
    private eventProducer: EventProducer;

    constructor(applicationContext: any) {
        this.applicationContext = applicationContext;
        this.logger = this.applicationContext.logger;
        this.eventProducer = new EventProducer(process.env.KAFKA_HOST!, 
            process.env.KAFKA_PORT! as unknown as number);
    }

    createMetadata(metadata: MetadataModel) {
        this.logger.logInfo(`Calling createMetadata with metadata: ${metadata}`);
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
        this.logger.logInfo(`Returning createMetadata`);
    }

    updateMetadata(metadata: MetadataModel) {
        this.logger.logInfo(`Calling updateMetadata with metadata: ${metadata}`);
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
        this.logger.logInfo(`Returning updateMetadata`);
    }

    deleteMetadata(id: string) {
        this.logger.logInfo(`Calling deleteMetadata with id: ${id}`);
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
        this.logger.logInfo(`Returning deleteMetadata`);
    }
}
