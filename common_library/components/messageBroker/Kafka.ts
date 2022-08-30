import {Kafka, Admin, Producer, Consumer, ProducerRecord, Message, ConsumerSubscribeTopics, logLevel} from 'kafkajs';
import EventTypeModel from '../../models/events/EventTypeModel';
import EventMessageModel from '../../models/events/EventMessageModel';
import Logging from './../../logging/Logging';

export default class Kakfa {
    private logger: Logging;
    private kafkaClient: Kafka;
    private admin: Admin;
    private producer: Producer;
    private consumer: Consumer;

    constructor(logger: Logging, host: string, port: number, consumerGroup: string) {
        this.logger = logger;
        this.logger.logDebug("Creating Kafka client, admin, producer & consumer");
        this.kafkaClient = new Kafka({  
            brokers: [`${host}:${port}`],
            logLevel: logLevel.INFO,
        });
        this.admin = this.kafkaClient.admin();
        this.producer = this.kafkaClient.producer();
        this.consumer = this.kafkaClient.consumer({ groupId: consumerGroup });
    }

    async initialize() {
        this.logger.logDebug("Initialzing Kafka");
        await this.admin.connect();
        await this.createTopics();
        await this.producer.connect();
        await this.consumer.connect();
        this.logger.logDebug("Kafka admin, producer & consumer connected");
        // this.admin.on('admin.connect', async () => {
        //     this.logger.logInfo("Kafka admin connected successfully");
        // });
        // this.producer.on('producer.connect', () => {
        //     this.logger.logInfo("Kafka producer connected successfully");
        // });
        // this.consumer.on('consumer.connect', () => {
        //     this.logger.logInfo("Kafka consumer connected successfully");
        // });
    }

    async createTopics() {
        let topics: {topic : string}[] = [];
        Object.values(EventTypeModel).forEach(eventType => {
            topics.push({ topic: eventType });
        });
        this.logger.logDebug("Creating Kafka topics");
        await this.admin.createTopics({
            waitForLeaders: false,
            topics: topics
        });
    }

    async subscribeTopics(topics: string[]) {
        this.logger.logInfo("Subscribing Kafka topics");
        await this.consumer.subscribe({topics: topics, fromBeginning: true} as ConsumerSubscribeTopics);
    }

    sendEvent(eventMessage: EventMessageModel) {
        this.logger.logDebug(`Sending Kafka message topic: ${eventMessage.topic}`);
        let record = {
            topic: eventMessage.topic,
            messages: [{
                value: eventMessage.message
            }] as Message[]
        } as ProducerRecord;
        this.producer.send(record);
    }

    receiveEvent(cb: (eventMessage: EventMessageModel) => any) {
        this.consumer.run({
            eachMessage: async ({ topic, message }) => {
                let eventMessage: EventMessageModel = {
                    topic: topic as EventTypeModel,
                    message: message.value?.toString()
                };
                this.logger.logDebug(`Received Kafka message topic: ${eventMessage.topic}`);
                cb(eventMessage);
            }
        });
    }
}
