import { Module } from '@nestjs/common';
import { ProfService } from './prof.service';
import { profSchema,Prof } from 'src/schema/prof.shema'
import { MongooseModule } from '@nestjs/mongoose';
import { KafkaModule } from 'src/kafka/kafka.module';

@Module({
  imports:[MongooseModule.forFeature([{name:Prof.name,schema:profSchema}]),KafkaModule],
  providers: [ProfService]
})
export class ProfModule {}
