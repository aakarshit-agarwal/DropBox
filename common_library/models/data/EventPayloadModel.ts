import {ProduceRequest} from 'kafka-node'
import EventTypeModel from "./EventTypeModel";

export default class EventPayloadModel implements ProduceRequest {
    topic: string;
    messages: any;
    key?: string | Buffer;
    partition?: number
    attributes?: number | undefined;

    constructor(topic: EventTypeModel, messages: any) {
        this.topic = topic.toString();
        this.messages = messages;
    }
}
