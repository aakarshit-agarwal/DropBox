import {KafkaClient, Producer} from 'kafka-node';
import EventPayloadModel from './../models/events/EventPayloadModel';

export default class EventProducer {
    private client: KafkaClient;
    private producer: Producer;

    constructor(host: string, port: number) {
        this.client = new KafkaClient({kafkaHost: `${host}:${port}`});
        this.producer = new Producer(this.client);

        this.producer.on('ready', async () => {
            console.log("Kafka producer initialized.");
        });
        this.producer.on('error', async () => {
            console.log("Falied initializing KAFKA producer.");
        });
    }

    sendMessages(payloads: EventPayloadModel[], cb: (error: any, data: any) => any) {
        this.producer.send(payloads, cb);
    }

    sendMessage(payload: EventPayloadModel, cb: (error: any, data: any) => any) {
        this.sendMessages([payload], cb);
    }
}
