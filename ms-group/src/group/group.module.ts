import { Module } from '@nestjs/common';
import { GroupController } from './group.controller';
import { GroupService } from './group.service';
import { Group,GroupSchema } from 'src/Entity/group.schema';
import { MongooseModule } from '@nestjs/mongoose';
import { GroupContainer ,GroupContainerSchema} from 'src/Entity/groupContainer';
import { AuthModule } from 'src/auth/auth.module';
import { MeetController } from './meet.controller';
import { ProducerService } from 'src/kafka/producer/producer.service';
import { KafkaModule } from 'src/kafka/kafka.module';
@Module({
  imports:[MongooseModule.forFeature([{name:Group.name,schema:GroupSchema},
    {name:GroupContainer.name,schema:GroupContainerSchema}                              
  ]),AuthModule,KafkaModule],
  controllers: [GroupController,MeetController],
  providers: [GroupService]
})
export class GroupModule {}
