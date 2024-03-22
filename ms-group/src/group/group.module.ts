import { Module } from '@nestjs/common';
import { GroupController } from './group.controller';
import { GroupService } from './group.service';
import { Group,GroupSchema } from 'src/Entity/group.schema';
import { MongooseModule } from '@nestjs/mongoose';
import { GroupContainer ,GroupContainerSchema} from 'src/Entity/groupContainer';
@Module({
  imports:[MongooseModule.forFeature([{name:Group.name,schema:GroupSchema},
    {name:GroupContainer.name,schema:GroupContainerSchema}                              
  ])],
  controllers: [GroupController],
  providers: [GroupService]
})
export class GroupModule {}
