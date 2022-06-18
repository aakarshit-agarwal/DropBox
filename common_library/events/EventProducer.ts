import {KafkaClient, Producer} from 'kafka-node';
import EventPayloadModel from './../models/events/EventPayloadModel';

export default class EventProducer {
    private client: KafkaClient;
    private producer: Producer;

    constructor() {
        this.client = new KafkaClient({kafkaHost: "kafka:9092"});
        this.producer = new Producer(this.client);

        this.producer.on('ready', async () => {
            console.log("Kafka producer is ready to sent message");
        });
        this.producer.on('error', async () => {
            console.log("Kafka producer is in error state");
        });
    }

    sendMessages(payloads: EventPayloadModel[], cb: (error: any, data: any) => any) {
        this.producer.send(payloads, cb);
    }

    sendMessage(payload: EventPayloadModel, cb: (error: any, data: any) => any) {
        this.sendMessages([payload], cb);
    }
}
