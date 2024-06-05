import { Injectable, OnModuleInit } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ConsumerService } from 'src/kafka/consumer/consumer.service';
import { Prof } from 'src/schema/prof.shema';
@Injectable()
export class ProfService implements OnModuleInit {
    constructor(private readonly consumerService: ConsumerService,
        @InjectModel(Prof.name) private Prof:Model<Prof>,
        ) {}
    async onModuleInit() {
        await this.consumerService.consume('prof-consumer',
      { topics: ['prof_created_notification'] },
      {
        eachMessage: async ({ topic, partition, message }) => {
            const messageString = message.value.toString();
            const eventData = JSON.parse(messageString);

            const newProf=new this.Prof({
                id_prof:eventData.id_prof,
                name:eventData.name,
                familyname:eventData.familyname,
                email:eventData.email,
                phone:eventData.phone
            })
            await newProf.save()
            console.log(newProf)    
        },
      },
    );
    }

     
    
}
