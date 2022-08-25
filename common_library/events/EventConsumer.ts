import {KafkaClient, Consumer, OffsetFetchRequest} from 'kafka-node';
import EventMessageModel from '../models/events/EventMessageModel';

export default class EventConsumer {
    private client: KafkaClient;
    private consumer: Consumer | undefined;

    constructor(topics: string[], host: string, port: number) {
        let fetchRequests: OffsetFetchRequest[] = [];
        topics.forEach(it => {
            fetchRequests.push({
                topic: it,
                partition: 0
            });
        });
        this.client = new KafkaClient({kafkaHost: `${host}:${port}`});
        this.client.on('ready', () => {
            this.consumer = new Consumer(this.client, fetchRequests, {});
        });
        this.client.on('error', error => {
            console.log("Error initializing KFKA consumer", error);
        });
    }

    receiveMessage(cb: (data: EventMessageModel) => any) {
        if(!this.consumer) {
            console.log("KFKA consumer not initialized.");
            return;
        }
        this.consumer.on('message', cb);
    }
}
