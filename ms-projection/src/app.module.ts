import { Module } from '@nestjs/common';
import { AppController } from './app.controller'; 
import { AppService } from './app.service';
import { ConsumerService } from './kafka/consumer/consumer.service';
import { KafkaModule } from './kafka/kafka.module';
import { GroupModule } from './group/group.module';
import { UserModule } from './user/user.module';
import { MongooseModule } from '@nestjs/mongoose';
import { GroupContainerModule } from './group-container/group-container.module';
import { EurekaModule } from 'nestjs-eureka';

@Module({
  imports: [MongooseModule.forRoot(process.env.MONGODB_URL), KafkaModule, GroupModule, UserModule, GroupContainerModule,
  EurekaModule.forRoot({
    eureka:{
      host:process.env.EUREKA_SERVER_HOST || 'localhost',
      port: process.env.EUREKA_SERVER_PORT ||8888,
      registryFetchInterval: 1000,
      maxRetries: 3,
    },
    service:{
      name:"ms-projection",
      port:3006
    }
  }),],  
  controllers: [AppController],
  providers: [AppService,ConsumerService],
})
export class AppModule {}

