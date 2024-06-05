import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { KafkaModule } from './kafka/kafka.module';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { ProfModule } from './prof/prof.module';
import { SessionNotificationModule } from './session-notification/session-notification.module';

@Module({
  imports: [KafkaModule,
    ConfigModule.forRoot(
      {
        envFilePath: '.env',
        isGlobal: true
      }
    ),
    MongooseModule.forRoot(process.env.MONGODB_URL),
    ProfModule,
    SessionNotificationModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
