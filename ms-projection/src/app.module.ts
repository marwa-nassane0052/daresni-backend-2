import { Module } from '@nestjs/common';
import { AppController } from './app.controller'; 
import { AppService } from './app.service';
import { ConsumerService } from './kafka/consumer/consumer.service';
import { KafkaModule } from './kafka/kafka.module';
import { GroupModule } from './group/group.module';
import { UserModule } from './user/user.module';
import { MongooseModule } from '@nestjs/mongoose';
import { GroupContainerModule } from './group-container/group-container.module';

@Module({
  imports: [MongooseModule.forRoot('mongodb://localhost:27017/ms-projection'), KafkaModule, GroupModule, UserModule, GroupContainerModule],
  controllers: [AppController],
  providers: [AppService,ConsumerService],
})
export class AppModule {}
