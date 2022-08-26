import {KafkaClient, Producer, Consumer, OffsetFetchRequest} from 'kafka-node';
import EventMessageModel from '../../models/events/EventMessageModel';
import EventPayloadModel from '../../models/events/EventPayloadModel';

export default class Kafka {
    private client: KafkaClient;
    public publisher: Publisher;
    public receiver: Receiver;

    constructor(host: string, port: number) {
        this.client = new KafkaClient({kafkaHost: `${host}:${port}`});
        this.client.on('ready', () => {
            console.log("KAFKA client is ready to use");
        });
        this.client.on('error', error => {
            console.log("Error initializing KFKA client", error);
            // throw error;
        });
    }

    public initializePublisher() {
        if(this.publisher === undefined) {
            this.publisher = new Publisher(this.client);
        }
        return this.publisher;
    }

    public initializeReceiver(topics: string[]) {
        if(this.receiver === undefined) {
            this.receiver = new Receiver(this.client, topics);
        }
        return this.receiver;
    }
}

export class Publisher {
    private producer: Producer;

    constructor(client: KafkaClient) {
        this.producer = new Producer(client);
        this.producer.on('ready', () => {
            console.log("KAFKA producer ready to use.");
        });
        this.producer.on('error', error => {
            console.log("KAFKA producer initialization failed.", error);
            // throw error;
        });
    }

    sendMessages(payloads: EventPayloadModel[], cb: (error: any, data: any) => any) {
        this.producer.send(payloads, cb);
    }

    sendMessage(payload: EventPayloadModel, cb: (error: any, data: any) => any) {
        this.sendMessages([payload], cb);
    }
}

export class Receiver {
    private consumer: Consumer;

    constructor(client: KafkaClient, topics: string[]) {
        let fetchRequests: OffsetFetchRequest[] = [];
        topics.forEach(it => {
            fetchRequests.push({
                topic: it,
                partition: 0
            });
        });
        this.consumer = new Consumer(client, fetchRequests, {});
        this.consumer.on('error', error => {
            console.log("KAFKA consumer initialization failed.", error);
            // throw error;
        });
    }

    receiveMessage(cb: (data: EventMessageModel) => any) {
        this.consumer.on('message', cb);
    }
}
