import { Module } from '@nestjs/common';
import { GroupContainerService } from './group-container.service';
import { KafkaModule } from 'src/kafka/kafka.module';
import { MongooseModule } from '@nestjs/mongoose';
import { GroupContainer, GroupContainerSchema } from 'src/schema/groupcontainer.schema';
import { Prof, ProfSchema } from 'src/schema/prof.schema';
import { GroupContainerController } from './group-container.controller';


@Module({
  imports: [MongooseModule.forFeature([{name:GroupContainer.name,schema:GroupContainerSchema},{name:Prof.name,schema:ProfSchema}]), KafkaModule],
  providers: [GroupContainerService],
  controllers: [GroupContainerController]
})
export class GroupContainerModule {}
