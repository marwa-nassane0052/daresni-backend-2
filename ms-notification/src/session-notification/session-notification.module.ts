import { Module } from '@nestjs/common';
import { SessionNotificationService } from './session-notification.service';
import { KafkaModule } from 'src/kafka/kafka.module';
import { SessionCreatedNotification,sessionNotificationSchema} from 'src/schema/createdSessionNotif.schema';
import { MongooseModule } from '@nestjs/mongoose';
import { Prof,profSchema } from 'src/schema/prof.shema';
@Module({
  imports:[KafkaModule,MongooseModule.forFeature([{name:SessionCreatedNotification.name,schema:sessionNotificationSchema},{name:Prof.name,schema:profSchema}])],
  providers: [SessionNotificationService]
})
export class SessionNotificationModule {}
