import {Message} from 'kafka-node'

export default class EventMessageModel implements Message {
    topic: string;
    value: string | Buffer;
    offset?: number | undefined;
    partition?: number | undefined;
    highWaterOffset?: number | undefined;
    key?: string | Buffer | undefined;
}
