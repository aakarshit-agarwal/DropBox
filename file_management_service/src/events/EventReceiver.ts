import EventConsumer from '@dropbox/common_library/events/EventConsumer';
import EventMessageModel from '@dropbox/common_library/models/events/EventMessageModel';
import EventTypeModel from '@dropbox/common_library/models/events/EventTypeModel';
import DirectoryDeletedEventModel from '@dropbox/common_library/models/events/DirectoryDeletedEventModel';
import ListFileRequestModel from '@dropbox/common_library/models/dto/ListFileRequestModel';
import Logger from './../logger/Logger';
import FileService from '../service/FileService';
import FileModel from '@dropbox/common_library/models/data/FileModel';

export default class EventReceiver {
    private topics: EventTypeModel[];
    private eventConsumer: EventConsumer;
    private fileService: FileService;

    constructor() {
        this.topics = [EventTypeModel.DELETE_DIRECTORY];
        this.eventConsumer = new EventConsumer(this.topics);
        this.fileService = new FileService();
    }

    public startListening() {
        this.eventConsumer.receiveMessage((data: EventMessageModel) => {
            this.handleEvents(data);
        });
    }

    private handleEvents(data: EventMessageModel) {
        Logger.logInfo(`Calling handleEvents with data: ${data}`);
        let topic = data.topic as EventTypeModel;
        let message = JSON.parse(data.value as string);
        switch(topic) {
            case EventTypeModel.DELETE_DIRECTORY: {
                this.handleDeletedDirectoryEvent(message);
                break;
            }
        }
        Logger.logInfo(`Returning handleEvents`);
    }

    private async handleDeletedDirectoryEvent(directoryDeletedEventData: DirectoryDeletedEventModel) {
        Logger.logInfo(`Calling handleDeletedDirectoryEvent with directoryDeletedEventData: ${directoryDeletedEventData}`);
        let listFilesInput: ListFileRequestModel = {
            userId: directoryDeletedEventData.userId,
            parentId: directoryDeletedEventData._id
        };
        let filesInDirectory: FileModel[] = await this.fileService.listFiles(listFilesInput);
        filesInDirectory.forEach(element => {
            this.fileService.deleteFile(element._id);
        });
        Logger.logInfo(`Returning handleDeletedDirectoryEvent`);
    }
}
