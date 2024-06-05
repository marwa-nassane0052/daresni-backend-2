import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ConsumerService } from 'src/kafka/consumer/consumer.service';
import { SessionCreatedNotification} from 'src/schema/createdSessionNotif.schema';
import { Prof } from 'src/schema/prof.shema';
@Injectable()
export class SessionNotificationService {
    constructor(private readonly consumerService: ConsumerService,
        @InjectModel(SessionCreatedNotification.name) private session:Model<SessionCreatedNotification>,
        @InjectModel(Prof.name) private profModel:Model<Prof>
        ) {}

        async onModuleInit() {
            await this.consumerService.consume('session-consumer',
          { topics: ['session_created_notification'] },
          {
            eachMessage: async ({ topic, partition, message }) => {
                const messageString = message.value.toString();
                const eventData = JSON.parse(messageString);
                console.log(eventData)
                const prof=await this.profModel.findOne({id_prof:eventData.createGc.profId})
                const sessionNotification=new this.session({
                    croupContainerId:eventData.createGc._id,
                    name:prof.name,
                    familyname:prof.familyname,
                    moduleName:eventData.createGc.moduleName,
                    level:eventData.createGc.level,
                    year:eventData.createGc.year,
                    speciality:eventData.createGc.speciality,
                    id_prof:eventData.createGc.profId
                })
                await sessionNotification.save()
                console.log(sessionNotification)
  
            },
          },
        );
        }
    
         
}
