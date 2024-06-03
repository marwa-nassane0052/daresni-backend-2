import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { KafkaModule } from 'src/kafka/kafka.module';
import { MongooseModule } from '@nestjs/mongoose';
import { Prof,ProfSchema} from 'src/schema/prof.schema';
@Module({
  imports: [MongooseModule.forFeature([{name:Prof.name,schema:ProfSchema}]), KafkaModule],
  providers: [UserService]
})
export class UserModule {}
