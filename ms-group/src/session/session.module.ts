import { Module } from '@nestjs/common';
import { SessionController } from './session.controller';
import { SessionService } from './session.service';
import { MongooseModule } from '@nestjs/mongoose';
import { GroupContainer,GroupContainerSchema} from 'src/Entity/groupContainer';
@Module({
  imports:[MongooseModule.forFeature([{name:GroupContainer.name,schema:GroupContainerSchema}])],
  controllers: [SessionController],
  providers: [SessionService]
})
export class SessionModule {}
