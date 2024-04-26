import { Injectable, OnModuleInit } from '@nestjs/common';
import { ConsumerService } from './kafka/consumer/consumer.service';

@Injectable()
export class AppService implements OnModuleInit {
  constructor(private readonly consumerService: ConsumerService) {}

  async onModuleInit() {
    // Consume Data with Spcific topic
    await this.consumerService.consume(
      { topics: ['user_creted','group_cretaed'] },
      {
        eachMessage: async ({ topic, partition, message }) => {
          // TODO: write event values into database
          console.log(topic, message.value.toString());
          // topic: article_created
          // message.value: data of user and article that the producer sent as a Buffer
          // We need convert buffer to string with "toString()"
        },
      },
    );
  }
}