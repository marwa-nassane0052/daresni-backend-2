import { Module } from '@nestjs/common';
import { SessionController } from './session.controller';
import { SessionService } from './session.service';
import { MongooseModule } from '@nestjs/mongoose';
import { GroupContainer,GroupContainerSchema} from 'src/Entity/groupContainer';
import { AuthModule } from 'src/auth/auth.module';
import { Group, GroupSchema } from 'src/Entity/group.schema';
@Module({
  imports:[MongooseModule.forFeature([{name:GroupContainer.name,schema:GroupContainerSchema},{name:Group.name,schema:GroupSchema}]),AuthModule],
  controllers: [SessionController],
  providers: [SessionService]
})
export class SessionModule {}
