import EventMessageModel from '@dropbox/common_library/models/events/EventMessageModel';
import EventTypeModel from '@dropbox/common_library/models/events/EventTypeModel';
import DirectoryDeletedEventModel from '@dropbox/common_library/models/events/DirectoryDeletedEventModel';
import ListFileRequestModel from '@dropbox/common_library/models/dto/ListFileRequestModel';
import FileService from '../service/FileService';
import FileModel from '@dropbox/common_library/models/data/FileModel';
import Logging from '@dropbox/common_library/logging/Logging';
import Kafka, { Receiver } from '@dropbox/common_library/components/messageBroker/Kafka';

export default class EventReceiver {
    private logger: Logging;
    private broker: Kafka;
    private fileService: FileService;
    private eventReceiver: Receiver;

    constructor(logger: Logging, broker: Kafka, fileService: FileService) {
        this.logger = logger;
        this.broker = broker;
        this.fileService = fileService;

        let topics = [EventTypeModel.DELETE_DIRECTORY];
        this.eventReceiver = this.broker.initializeReceiver(topics);
    }

    public startListening() {
        this.eventReceiver.receiveMessage((data: EventMessageModel) => {
            this.handleEvents(data);
        });
    }

    private handleEvents(data: EventMessageModel) {
        this.logger.logInfo(`Calling handleEvents with data: ${data}`);
        let topic = data.topic as EventTypeModel;
        let message = JSON.parse(data.value as string);
        switch(topic) {
            case EventTypeModel.DELETE_DIRECTORY: {
                this.handleDeletedDirectoryEvent(message);
                break;
            }
        }
        this.logger.logInfo(`Returning handleEvents`);
    }

    private async handleDeletedDirectoryEvent(directoryDeletedEventData: DirectoryDeletedEventModel) {
        this.logger.logInfo(`Calling handleDeletedDirectoryEvent with directoryDeletedEventData: ${directoryDeletedEventData}`);
        let listFilesInput: ListFileRequestModel = {
            userId: directoryDeletedEventData.userId,
            parentId: directoryDeletedEventData._id
        };
        let filesInDirectory: FileModel[] = await this.fileService.listFiles(listFilesInput);
        filesInDirectory.forEach(element => {
            this.fileService.deleteFile(element._id);
        });
        this.logger.logInfo(`Returning handleDeletedDirectoryEvent`);
    }
}
