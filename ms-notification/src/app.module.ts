import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { KafkaModule } from './kafka/kafka.module';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { ProfModule } from './prof/prof.module';
import { SessionNotificationModule } from './session-notification/session-notification.module';
import { EurekaModule } from 'nestjs-eureka';

@Module({
  imports: [KafkaModule,
    ConfigModule.forRoot(
      {
        envFilePath: '.env',
        isGlobal: true
      }
    ),
<<<<<<< HEAD
    MongooseModule.forRoot("mongodb://localhost:27017/ms-notification"),
=======
    EurekaModule.forRoot({
      eureka:{
        host:  process.env.EUREKA_SERVER_HOST || 'localhost',
        port:  process.env.EUREKA_SERVER_PORT ||8888,
        registryFetchInterval: 1000,
        maxRetries: 3,
      },
      service:{
        name:"ms-notification",
        port:3040
      }
    }), 
    MongooseModule.forRoot(process.env.MONGODB_URL),
>>>>>>> 8f0750893df544dd38f5781ba82d004b9e41a733
    ProfModule,
    SessionNotificationModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
