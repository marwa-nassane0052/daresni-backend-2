import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { GroupModule } from './group/group.module';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { EurekaModule } from 'nestjs-eureka';
import { SessionModule } from './session/session.module';
import { DocumentModule } from './document/document.module';
import { AuthModule } from './auth/auth.module';
import { ProducerService } from './kafka/producer/producer.service';
import { KafkaModule } from './kafka/kafka.module';
@Module({
  imports: [GroupModule,
    ConfigModule.forRoot(
      {
        envFilePath: '.env',
        isGlobal: true
      }
    ),
    MongooseModule.forRoot(process.env.MONGODB_URL),
 
    SessionModule,
    
    DocumentModule,
    AuthModule,
    KafkaModule, 
    

  ],
  controllers: [AppController],
  providers: [AppService, ProducerService],
})
export class AppModule {}

/*
 
  EurekaModule.forRoot({
      eureka:{
        host: 'localhost',
        port: 8888,
        registryFetchInterval: 1000,
        maxRetries: 3,
      },
      service:{
        name:"ms-group",
        port:3001
      }
    }),
 */
