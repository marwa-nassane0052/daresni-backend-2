import { Catch, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateGcDto } from 'src/Dto/createGD.dto';
import { GroupContainer } from 'src/Entity/groupContainer';
import { Level } from 'src/enum/level';

@Injectable()
export class SessionService {
    constructor(@InjectModel(GroupContainer.name) private groupContainer:Model<GroupContainer>){}
    async getAllGroupContainers():Promise<GroupContainer[]>{
        return  await this.groupContainer.find()
    }

    async createGroupContainerCem(profId:string,CreateGcDto:CreateGcDto):Promise<GroupContainer>{

        const newGroupContainer=new this.groupContainer({
            moduleName:CreateGcDto.moduleName,
            profId:profId,
            level:Level.CEM,
            year:CreateGcDto.year,  
            studentNumber:CreateGcDto.studentNumber,
            price:CreateGcDto.price,
            sessionsNumberPerWeek:CreateGcDto.sessionsNumberPerWeek,
            studyDuration:CreateGcDto.studyDuration,
            sessionDuration:CreateGcDto.sessionDuration,
            valide:false
        })

        return await newGroupContainer.save()
    }

    async createGroupContainerLycee(profId:string,CreateGcDto:CreateGcDto):Promise<GroupContainer>{

        const newGroupContainer=new this.groupContainer({
            moduleName:CreateGcDto.moduleName,
            profId:profId,
            level:Level.LYCEE,
            speciality:CreateGcDto.speciality,
            year:CreateGcDto.year,  
            studentNumber:CreateGcDto.studentNumber,
            price:CreateGcDto.price,
            sessionsNumberPerWeek:CreateGcDto.sessionsNumberPerWeek,
            studyDuration:CreateGcDto.studyDuration,
            sessionDuration:CreateGcDto.sessionDuration,
            valide:false
            
        })

        return await newGroupContainer.save()
    }

    async findGroupContainer(profId:string,CreateGcDto:CreateGcDto):Promise<GroupContainer>{
        const groupContainer=await this.groupContainer.findOne({
            moduleName:CreateGcDto.moduleName,
            profId:profId,
            year:CreateGcDto.year,  
            speciality:CreateGcDto.speciality,
            studentNumber:CreateGcDto.studentNumber,
            price:CreateGcDto.price,
            sessionsNumberPerWeek:CreateGcDto.sessionsNumberPerWeek,
            studyDuration:CreateGcDto.studyDuration,
            sessionDuration:CreateGcDto.sessionDuration
        })
        return groupContainer
    }
    //validate session
    async validateGroupContainer(idGC:string){
        try{
            const groupContainer=await this.groupContainer.findByIdAndUpdate(idGC,{
                valide:true
            },{new:true})
            return groupContainer
        }catch(err){
            console.log(err)
        }
    }

    async getValidateGroup(){
        try{
            const groupContainers=await this.groupContainer.find({valide:true})
            return groupContainers
        }catch(err){
            console.log(err)
        }
         
       
    }
    async groupContainerByProf(idProf:string){
        try{
            const groupContainers=await this.groupContainer.find({profId:idProf,valide:true})
            return groupContainers
        }catch(err){
            console.log(err)
        }
    }
}
