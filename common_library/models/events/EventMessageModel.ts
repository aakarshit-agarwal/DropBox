import EventTypeModel from "./EventTypeModel";

export default class EventMessageModel {
    topic: EventTypeModel;
    message: string | undefined;

    constructor(topic: EventTypeModel, message: string | undefined) {
        this.topic = topic;
        this.message = message
    }
}
