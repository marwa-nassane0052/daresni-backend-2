import { Injectable, OnApplicationShutdown, OnModuleInit } from '@nestjs/common';
import { Kafka,Consumer,ConsumerRunConfig,ConsumerSubscribeTopics} from 'kafkajs';
@Injectable()
export class ConsumerService implements OnApplicationShutdown {
    private readonly Kafka=new Kafka({
        brokers:['localhost:9092']
    })
    private readonly consumers: Consumer[] = [];

    async consume(topics: ConsumerSubscribeTopics, config: ConsumerRunConfig) {
        // We need to spcifiy the groupID while initializing the Kafka Consumer
        const consumer = this.Kafka.consumer({ groupId: 'blog-kafka' });
    
        // Connecting Consumer
        await consumer.connect();
    
        //Passing Topics to consumer
        await consumer.subscribe(topics);
    
        //Setting  the Consumer Config
        await consumer.run(config);
    
        //Gathering all the Consumers
        this.consumers.push(consumer);
      }
      
      async onApplicationShutdown() {
        // Disconnect all the consumer on Apllication shutdown
        for (const consumer of this.consumers) {
          await consumer.disconnect();
        }
      }
}
