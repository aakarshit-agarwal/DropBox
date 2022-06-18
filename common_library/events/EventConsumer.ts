import {KafkaClient, Consumer, OffsetFetchRequest} from 'kafka-node';
import EventMessageModel from '../models/events/EventMessageModel';

export default class EventConsumer {
    private client: KafkaClient;
    private consumer: Consumer;

    constructor(topics: string[]) {
        let fetchRequests: OffsetFetchRequest[] = [];
        topics.forEach(it => {
            fetchRequests.push({
                topic: it,
                partition: 0
            });
        });
        this.client = new KafkaClient({kafkaHost: "kafka:9092"});
        this.consumer = new Consumer(this.client, fetchRequests, {});
    }

    receiveMessage(cb: (data: EventMessageModel) => any) {
        this.consumer.on('message', cb);
    }
}
