import { Injectable, OnModuleInit } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ConsumerService } from 'src/kafka/consumer/consumer.service';
import { Prof } from 'src/schema/prof.schema';

@Injectable()
export class UserService implements OnModuleInit {
    constructor(private readonly consumerService: ConsumerService,
             @InjectModel(Prof.name) private profModel:Model<Prof>
             ) {}

  async onModuleInit() {
    // Consume Data with Spcific topic
    await this.consumerService.consume('user-consumer',
      { topics: ['user_created'] },
      {
        eachMessage: async ({ topic, partition, message }) => {
            const messageString = message.value.toString();
            const eventData = JSON.parse(messageString);
            console.log(eventData)
            const newProf=new this.profModel({
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

    await this.consumerService.consume('deleteProf-consumer',
    { topics: ['delete_prof'] },
    {
      eachMessage: async ({ topic, partition, message }) => {
          const messageString = message.value.toString();
          const eventData = JSON.parse(messageString);
          console.log("the id",eventData)
          await this.profModel.deleteOne({id_prof:eventData.id_prof})
      
      },
    },
  );
  }
}
