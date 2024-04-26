import { Module } from '@nestjs/common';
import { AppController } from './app.controller'; 
import { AppService } from './app.service';
import { ConsumerService } from './kafka/consumer/consumer.service';
import { KafkaModule } from './kafka/kafka.module';

@Module({
  imports: [ KafkaModule],
  controllers: [AppController],
  providers: [AppService,ConsumerService],
})
export class AppModule {}
