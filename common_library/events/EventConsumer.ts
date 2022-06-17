import {KafkaClient, Consumer} from 'kafka-node';
import EventMessageModel from './../models/data/EventMessageModel';

export default class EventConsumer {
    private client: KafkaClient;
    private consumer: Consumer;

    constructor(topic: string) {
        this.client = new KafkaClient({kafkaHost: "kafka:9092"});
        this.consumer = new Consumer(this.client, [{ topic: topic, partition: 0 }], {});
    }

    receiveMessage(cb: (data: EventMessageModel) => any) {
        this.consumer.on('message', cb);
    }
}
