import { Module } from '@nestjs/common';
import { DocumentService } from './document.service';
import { DocumentController } from './document.controller';
import { Group,GroupSchema } from 'src/Entity/group.schema';
import { GroupContainer,GroupContainerSchema } from 'src/Entity/groupContainer';
import { MongooseModule } from '@nestjs/mongoose';
@Module({
  imports:[MongooseModule.forFeature([{name:Group.name,schema:GroupSchema},
    {name:GroupContainer.name,schema:GroupContainerSchema}                              
  ])],
  providers: [DocumentService],
  controllers: [DocumentController]
})
export class DocumentModule {}
