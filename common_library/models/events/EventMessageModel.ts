import {Message} from 'kafka-node'

export default class EventMessageModel implements Message {
    constructor(topic: string, value: string | Buffer) {
        this.topic = topic;
        this.value = value;
    }
    topic: string;
    value: string | Buffer;
    offset?: number | undefined;
    partition?: number | undefined;
    highWaterOffset?: number | undefined;
    key?: string | Buffer | undefined;
}
