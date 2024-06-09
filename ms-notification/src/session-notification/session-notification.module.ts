import { Module } from '@nestjs/common';
import { SessionNotificationService } from './session-notification.service';
import { KafkaModule } from 'src/kafka/kafka.module';
import { SessionCreatedNotification,sessionNotificationSchema} from 'src/schema/createdSessionNotif.schema';
import { MongooseModule } from '@nestjs/mongoose';
import { Prof,profSchema } from 'src/schema/prof.shema';
import { NotificationSchema,Notification } from 'src/schema/notification';
import { SessionNotificationController } from './session-notification.controller';
@Module({
  imports:[KafkaModule,MongooseModule.forFeature([{name:SessionCreatedNotification.name,schema:sessionNotificationSchema},
    {name:Prof.name,schema:profSchema},
    {name:Notification.name,schema:NotificationSchema},


  ])],
  providers: [SessionNotificationService],
  controllers: [SessionNotificationController]
})
export class SessionNotificationModule {}
