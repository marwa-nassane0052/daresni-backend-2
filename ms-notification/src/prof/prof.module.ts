import { Module } from '@nestjs/common';
import { ProfService } from './prof.service';
import { profSchema,Prof } from 'src/schema/prof.shema'
import { MongooseModule } from '@nestjs/mongoose';
import { KafkaModule } from 'src/kafka/kafka.module';
import { NotificationSchema,Notification } from 'src/schema/notification';


@Module({
  imports:[MongooseModule.forFeature([{name:Prof.name,schema:profSchema},{name:Notification.name,schema:NotificationSchema}]),KafkaModule],
  providers: [ProfService]
})
export class ProfModule {}
