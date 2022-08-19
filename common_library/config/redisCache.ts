import {createClient, RedisClientOptions} from 'redis';

export default class RedisCache {
    private redisClient;

        constructor(host: string, port: number) {
        let config : RedisClientOptions = {
            socket: {
                host: host,
                port: port
            },
            password: "eYVX7EwVmmxKPCDmwMtyKVge8oLd2t81"
        };
        this.redisClient = createClient(config);
        this.redisClient.connect().then(() => {
            console.log("Connected to Redis Cache.");
        });

        this.redisClient.on('error', (error) => {
            console.log("Could not connect cache error: ", error);
        });
    }

    async get(key: any) {
        return await this.redisClient.get(key);
    }

    async set(key: any, value: any) {
        return await this.redisClient.set(key, value);
    }

    async remove(key: any) {
        return await this.redisClient.del(key);
    }

    async hSet(key: any, field: any, value: any) {
        return await this.redisClient.hSet(key, field, value);
    }

    async hGet(key: any, field: any) {
        return await this.redisClient.hGet(key, field);
    }

    async hRemove(key: any, field: any) {
        return await this.redisClient.hDel(key, field);
    }
}
