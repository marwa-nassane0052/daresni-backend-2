import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ConsumerService } from 'src/kafka/consumer/consumer.service';
import { SessionCreatedNotification} from 'src/schema/createdSessionNotif.schema';
import { Prof } from 'src/schema/prof.shema';
import { Notification } from 'src/schema/notification';
@Injectable()
export class SessionNotificationService {
    constructor(private readonly consumerService: ConsumerService,
        @InjectModel(SessionCreatedNotification.name) private session:Model<SessionCreatedNotification>,
        @InjectModel(Prof.name) private profModel:Model<Prof>,
        @InjectModel(Notification.name) private Notification:Model<Notification>
        ) {}

        async onModuleInit() {
            await this.consumerService.consume('session-consumer-notification-2',
          { topics: ['session_notification_new_2'] },
          {
            eachMessage: async ({ topic, partition, message }) => {
                const messageString = message.value.toString();
                const eventData = JSON.parse(messageString);
                const prof=await this.profModel.findOne({id_prof:eventData.createGc.profId})

                const sessionNotification=new this.session({
                    croupContainerId:eventData.createGc._id,
                    name:prof.name,
                    familyname:prof.familyname,
                    email:prof.email,
                    moduleName:eventData.createGc.moduleName,
                    level:eventData.createGc.level,
                    year:eventData.createGc.year,
                    speciality:eventData.createGc.speciality,
                    id_prof:eventData.createGc.profId
                })
                await sessionNotification.save()
                const notification =  new this.Notification({
                  familyname:sessionNotification.familyname,
                  name:sessionNotification.name,
                  email:prof.email,
                  userType:"admin",
                  notificationContent:`une nouvelle session de ${sessionNotification.level} et ${sessionNotification.year} et ${sessionNotification.moduleName} a été créée par le prof ${sessionNotification.familyname} ${sessionNotification.name}`
                })

                await notification.save()
            },
          },
        );


        await this.consumerService.consume('validate_notification_consumer',
        { topics: ['validate_session_notification_2'] },
        {
          eachMessage: async ({ topic, partition, message }) => {
              const messageString = message.value.toString();
              const eventData = JSON.parse(messageString);
             const prof=await this.profModel.findOne({id_prof:eventData.validateGC.profId})
            const session=await this.session.findOne({croupContainerId:eventData.validateGC._id})
              const notification=new this.Notification({
                  name:"admin",
                  familyname:"la validation de session",
                  email:prof.email,
                  userType:"prof",
                  notificationContent:`votre session ${session.moduleName} ${session.level} ${session.year} ${session.speciality} a été validée par l'administration`
              })
              await notification.save()
              console.log(notification)
          },
        },
      );




      await this.consumerService.consume('refuse_notification_consumer',
        { topics: ['refuse_session_notification_2'] },
        {
          eachMessage: async ({ topic, partition, message }) => {
              const messageString = message.value.toString();
              const eventData = JSON.parse(messageString);
               const session=await this.session.findOne({croupContainerId:eventData.idS})
              const notification=new this.Notification({
                  name:"admin",
                  familyname:"la session a été refusé",
                  email:session.email,
                  userType:"prof",
                  notificationContent:`votre session ${session.moduleName} ${session.level} ${session.year} ${session.speciality} a été refusé par l'administration`
              })
              await notification.save()
          },
        },
      );

        }


    
         async getAdminNotification(){
          try{
            return await this.Notification
            .find({ userType: 'admin' })
            .sort({ created_at: -1 }) // Sort by createdDate in descending order
            .limit(7); 
          }catch(err){
            console.log(err)
          }
         }

         async getProfNotification(email:string){
          try{
            return await this.Notification
            .find({ userType: 'prof',email:email})
            .sort({ created_at: -1 }) // Sort by createdDate in descending order
            .limit(7); 
          }catch(err){
            console.log(err)
          }
         }
}
