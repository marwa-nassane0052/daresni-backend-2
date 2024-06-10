import { Injectable, OnModuleInit } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { fillterDto } from 'src/dto/fillter.dto';
import { ConsumerService } from 'src/kafka/consumer/consumer.service';
import { GroupContainer } from 'src/schema/groupcontainer.schema';
import { Prof } from 'src/schema/prof.schema';

@Injectable()
export class GroupContainerService implements OnModuleInit {
    constructor(private readonly consumerService: ConsumerService,
        @InjectModel(Prof.name) private profModel:Model<Prof>,
        @InjectModel(GroupContainer.name) private groupContainerModel:Model<GroupContainer>
        ) {}
    async onModuleInit() {
        await this.consumerService.consume('groupContainer-consumer8',
          { topics: ['groupContainer_created_event'] },
          {
            eachMessage: async ({ topic, partition, message }) => {

                const messageString = message.value.toString();
                const eventData = JSON.parse(messageString);
                console.log("evenet data",eventData)

                const prof=await this.profModel.findOne({id_prof:eventData.createGc.profId})
                console.log("prof dtata",prof)

                const newGroupConatiner=new this.groupContainerModel({
                    moduleName:eventData.createGc.moduleName,
                    level:eventData.createGc.level,
                    year:eventData.createGc.year,
                    speciality:eventData.createGc.speciality,
                    price:eventData.createGc.price,
                    studentNumber:eventData.createGc.studentNumber,
                    studyDuration:eventData.createGc.studyDuration,
                    sessionDuration:eventData.createGc.sessionDuration,
                    sessionsNumberPerWeek:eventData.createGc.sessionsNumberPerWeek,
                    croupContainerId:eventData.createGc._id,
                    valide:eventData.createGc.valide
                })
                await newGroupConatiner.save()
                prof.groupContainers.push(eventData.createGc._id)
                console.log(newGroupConatiner)
                await prof.save()
              
            },
          },
        );

        await this.consumerService.consume('validateGroup-consumer',
          { topics: ['validate_group_2'] },
          {
            eachMessage: async ({ topic, partition, message }) => {

                const messageString = message.value.toString();
                const eventData = JSON.parse(messageString);
                const groupContainer=await this.groupContainerModel.findOne({
                  croupContainerId:eventData.validateGC._id
                  })
                groupContainer.valide=true
                console.log(groupContainer)
                await groupContainer.save()
              
            },
          },
        );

        await this.consumerService.consume('deletesession-consumer',
        { topics: ['refuse_session'] },
        {
          eachMessage: async ({ topic, partition, message }) => {
              const messageString = message.value.toString();
              const eventData = JSON.parse(messageString);
              console.log("the id",eventData)
              await this.groupContainerModel.deleteOne({croupContainerId:eventData.idS})
          
          },
        },
      );
      }


      async fillter(fillterData:fillterDto) {
        try {
            const resulte = await this.profModel.aggregate([
                {
                  $lookup:{
                    from: "groupcontainers", 
                    localField: "groupContainers", 
                    foreignField: "croupContainerId",
                    as: "groupContainers" 
                  }
                },
                {
                  $unwind: '$groupContainers' 
                },
                {
                  $match: {
                      'groupContainers.moduleName': fillterData.moduleName,
                      'groupContainers.level': fillterData.level,
                      'groupContainers.year': fillterData.year,
                      'groupContainers.speciality': fillterData.speciality,
                      'groupContainers.price': fillterData.price
                  }
              },
               
                
                
            ]);
            return resulte;
        } catch (err) {
            console.log(err)
        }
    }



    //get croup container with session details
    async getGroupContainer(){
      try{
        const resulte=await this.profModel.aggregate([
          {
            $lookup:{
              from: "groupcontainers", 
              localField: "groupContainers", 
              foreignField: "croupContainerId",
              as: "sessionInfo" 
            }
          },
          {
            $unwind: '$sessionInfo' 
          },
          { 
            $project:{
              name:1,
              familyname:1,
              email:1,
              "sessionInfo.croupContainerId":1,
              "sessionInfo.moduleName":1,
              "sessionInfo.level":1,
              "sessionInfo.speciality":1,
              "sessionInfo.price":1,
              "sessionInfo.valide":1,

            }
          }
        ])
        return resulte
      }catch(err){
        console.log(err)
      }
    }


    async getGroupContainerById(idGc:string){
      try{
        const resulte=await this.profModel.aggregate([
          {
            $lookup:{
              from: "groupcontainers", 
              localField: "groupContainers", 
              foreignField: "croupContainerId",
              as: "sessionInfo" 
            }
          },
          {
            $unwind: '$sessionInfo' 
          },
          {
            $match:{
              "sessionInfo.croupContainerId":idGc
            }
          },
          { 
            $project:{
              name:1,
              familyname:1,
              email:1,
              "sessionInfo.croupContainerId":1,
              "sessionInfo.moduleName":1,
              "sessionInfo.level":1,
              "sessionInfo.year":1,
              "sessionInfo.speciality":1,
              "sessionInfo.price":1,
              "sessionInfo.valide":1,
              "sessionInfo.studentNumber":1,
              "sessionInfo.sessionDuration":1,
              "sessionInfo.studyDuration":1,
              "sessionInfo.sessionsNumberPerWeek":1
            }
          }
        ])
        return resulte
      }catch(err){
        console.log(err)
      }
    }
  }    
