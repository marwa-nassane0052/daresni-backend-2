import { Catch, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { validate } from 'class-validator';
import { Model } from 'mongoose';
import { CreateGcDto } from 'src/Dto/createGD.dto';
import { Group } from 'src/Entity/group.schema';
import { GroupContainer } from 'src/Entity/groupContainer';
import { Level } from 'src/enum/level';
import { ProducerService } from 'src/kafka/producer/producer.service';

@Injectable()
export class SessionService {
    constructor(@InjectModel(GroupContainer.name) private groupContainer:Model<GroupContainer>,
    @InjectModel(Group.name) private groupModel:Model<Group> 
    ){}


    async getAllGroupContainers():Promise<GroupContainer[]>{
        return  await this.groupContainer.find({valide:true})
    }

    async getGroupCOntainerById(idGC:string){
        return await this.groupContainer.findById(idGC)
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
        const data={
            moduleName:CreateGcDto.moduleName,
            profId:profId,
            year:CreateGcDto.year,  
            studentNumber:CreateGcDto.studentNumber,
            price:CreateGcDto.price,
            sessionsNumberPerWeek:CreateGcDto.sessionsNumberPerWeek,
            studyDuration:CreateGcDto.studyDuration,
            sessionDuration:CreateGcDto.sessionDuration
        }
        if(CreateGcDto.speciality){
            data["speciality"]=CreateGcDto.speciality
        }
        console.log(data)
        const groupContainer=await this.groupContainer.findOne(data)
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
            const groupContainers=await this.groupContainer.find({profId:idProf})
            return groupContainers
        }catch(err){
            console.log(err)
        }
    }
    //delete if groups arry=0 or groups.student=0
    async deleteGc(idGC:String){
        try{
            return await this.groupContainer.findByIdAndDelete(idGC)
        }catch(err){
            console.log(err)
        }
    }

    async getGroups(idGC:String){
        try{
            
            const gc = await this.groupContainer.findById(idGC);
            if (!gc || !gc.groups) {
                return false; // or handle the case as needed
            }
            const existeStudent = await Promise.all(gc.groups.map(async (group) => {
                const foundGroup = await this.groupModel.findById(group._id);
                return foundGroup.studentList.length > 0;
            })).then(results => results.some(result => result));
    
            return existeStudent;
                    

        }catch(err){
            console.log(err)
        }
    }



    async updateGc(idGC:String,createGc:CreateGcDto){
        try{
            return await this.groupContainer.findByIdAndUpdate(
                idGC,
                {
                    moduleName:createGc.moduleName,
                    level:createGc.level,
                    year:createGc.year,
                    speciality:createGc.speciality,
                    price:createGc.price,
                    studentNumber:createGc.studentNumber,
                    studyDuration:createGc.studyDuration,
                    sessionDuration:createGc.sessionDuration,
                    valide:false
                    
                },
                {new:true}
            )
        }catch(err){
            console.log(err)
        }
    }

    async getGroupOfSession(idGC: string) {
        try {
            const groupContainer = await this.groupContainer.findById(idGC);
            
            if (!groupContainer) {
                throw new Error(`GroupContainer with id ${idGC} not found`);
            }
    
            const groupPromises = groupContainer.groups.map(e => this.groupModel.findById(e));
            const groups = await Promise.all(groupPromises);
            
            return groups;
        } catch (err) {
            console.log(err);
            throw new Error(`Failed to get groups of session: ${err.message}`);
        }
    }

    async deleteSession(idS:String){
        try{
           await this.groupContainer.findByIdAndDelete(idS)
           return `the ${idS} has been deleted`
        }catch(err){
            console.log(err)
        }
    }
    
    async sessionNumber(){
        try{
           return await this.groupContainer.countDocuments({valide:true});
           
        }catch(err){
            console.log(err)
        }
    }

    async sessionNumberForProf(idP:string){
        try{
           return await this.groupContainer.countDocuments({valide:true,profId:idP});
           
        }catch(err){
            console.log(err)
        }
    }

    async getNumberOfGroup() {
        try {
            return await this.groupModel.countDocuments()
            
        } catch (err) {
            console.log(err);
        }
    }
    async getAllProfit() {
        try {
            const sessions = await this.groupContainer.find();
            let totalProfit = 0; // Initialize the totalProfit to accumulate the profit
    
            for (const session of sessions) {
                const price: number = Number(session.price);
                for (const groupId of session.groups) {

                    const group = await this.groupModel.findById(groupId);
                    if (group) {
                        const studentCount: number = group.studentList.length;

                        totalProfit +=  price *studentCount
                    }
                }
            }
    
            return totalProfit; // Return the accumulated profit
        } catch (err) {
            console.log(err);
            throw err; // Optional: rethrow the error if you want to handle it elsewhere
        }
    }
    

}
