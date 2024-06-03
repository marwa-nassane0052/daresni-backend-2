import { Injectable, OnApplicationShutdown } from '@nestjs/common';
import { Kafka, Consumer, ConsumerRunConfig, ConsumerSubscribeTopics } from 'kafkajs';

@Injectable()
export class ConsumerService implements  OnApplicationShutdown {
    private readonly Kafka = new Kafka({
        brokers: ['localhost:9092']
    });
    private readonly consumers: Map<string, Consumer> = new Map(); // Use a Map to store consumers with groupId as key

    async consume(groupId: string, topics: ConsumerSubscribeTopics, config: ConsumerRunConfig) {
        // Initialize Kafka consumer with specified groupId
        const consumer = this.Kafka.consumer({ groupId });
    
        // Connect consumer
        await consumer.connect();
    
        // Subscribe to topics
        await consumer.subscribe(topics);
    
        // Run consumer with provided config
        await consumer.run(config);
    
        // Store the consumer with groupId as key
        this.consumers.set(groupId, consumer);
    }
      
   async onApplicationShutdown() {
        // Disconnect all consumers on application shutdown
        for (const consumer of this.consumers.values()) {
            await consumer.disconnect();
        }
    }
}
