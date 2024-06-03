import { Module } from '@nestjs/common';
import { GroupService } from './group.service';
import { GroupController } from './group.controller';
import { KafkaModule } from 'src/kafka/kafka.module';
import { MongooseModule } from '@nestjs/mongoose';
import { GroupContainer, GroupContainerSchema } from 'src/schema/groupcontainer.schema';
import { Prof, ProfSchema } from 'src/schema/prof.schema';

@Module({
  imports: [MongooseModule.forFeature([{name:GroupContainer.name,schema:GroupContainerSchema},{name:Prof.name,schema:ProfSchema}]), KafkaModule],
  providers: [GroupService],
  controllers: [GroupController]
})
export class GroupModule {}
