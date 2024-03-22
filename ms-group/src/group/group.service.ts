import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import mongoose, { Model, ObjectId } from 'mongoose';
import { Group } from 'src/Entity/group.schema';
import { CreateGroupDto } from 'src/Dto/createGroup.dto';
import { GroupContainer } from 'src/Entity/groupContainer';
import { group } from 'console';

@Injectable()
export class GroupService {
    constructor(@InjectModel(Group.name) private groupModel:Model<Group>,
                @InjectModel(GroupContainer.name) private groupContainer:Model<GroupContainer>
       ){}

    async getGroups():Promise<Group[]>{
        const groups=this.groupModel.find()
        return groups
    }


    async getGroupById(idGroup:string){
        const group= await this.groupModel.findById(idGroup)
    }

    async getGroupContainerById(idGroupContainer:string){
        return await this.groupContainer.findById(idGroupContainer)
    }

    async createGroup(gcId:string,createGroupDto:CreateGroupDto):Promise<Group>{
        const groupConatiner=await this.groupContainer.findById(gcId)
        const group=new this.groupModel({
            groupName:createGroupDto.groupName,
            startingDates:createGroupDto.startingDate,
            deadlineDate:createGroupDto.deadlineDate,
            groupContainer:gcId
        })

        createGroupDto.startingDate.forEach((e,index)=>{
            group.planing.push({
                sessionNumber:`session${index+1}`,
                dates:this.generateCalendarGroup(e,groupConatiner.studyDuration)
            })
        })
        await group.save()
        groupConatiner.groups.push(group._id)
        await groupConatiner.save()
        return group
    }
  
    //to find group with the same name
    async findGroupInConatiner(idGP:string,groupName:string){
        const group=await this.groupModel.findOne({
            groupName:groupName,
            groupContainer:idGP
        })
        return group
    }

    //get all dates in calnder of specific prof for all of his section
    async getDates(profId:string){
        const groupsContainers=await this.groupContainer.aggregate([
            {
                $match:{
                    profId:profId
                },
            },
            {  
                $lookup: {
                    from: 'groups',
                    localField: 'groups', 
                    foreignField: '_id', 
                    as: 'groupData'
                }
            
            },
            {
                $unwind: '$groupData' 
            },
            {
                $group: {
                    _id: '$profId', 
                    startingDates: { $push: '$groupData.planing.dates' } // Push startingDates into an array
                }
            }
            

        ])
      var dates=[]
       groupsContainers.forEach((e)=>{
        const startingDates = e.startingDates;
        startingDates.forEach((d) => {
            d.forEach((date)=>{
                date.forEach((dt)=>{
                    dates.push(dt)
                })
                
            })
        });
       })
       return dates
    }

     //generate a clander for the incomming weed
    generateCalendarGroup(startingDate:Date,weekNumber:Number):Date[]{
        const currentDate = new Date(startingDate);
        
        const endDate = new Date(currentDate);
        endDate.setDate(currentDate.getDate() + (parseInt(weekNumber as unknown as string) * 7));
        const dates = [];
        let tempDate = new Date(currentDate);
        while (tempDate <= endDate) {
            dates.push(new Date(tempDate.getTime())); 
            tempDate.setDate(tempDate.getDate() + 7); 
        }
        dates.pop()
        return dates    
      }

     //to ckeck if the station are not existe in the calnder of the prof
     findMatchingValue(mainTable: Date[], smallTable: Date[]): Date[] {
        return mainTable.filter(date => smallTable.some(d => d.getTime() === date.getTime()));}


     //upload file in the group

     //upload vidio

     //add student in the group
     async addStudent(idStudent:string,idGC:string,idGroup:string){
        const groupContainer= await this.groupContainer.findById(idGC)
        const objectId=new mongoose.Types.ObjectId(idGroup)
        if(groupContainer.groups.includes(objectId)){
            const group= await this.groupModel.findById(idGroup)
            group.studentList.push(idStudent)
            return await group.save()
        }
        else{
        return null
        }
     }

     async getStudentNumberIngroup(idGC:string,idGroup:string){
        const groupContainer= await this.groupContainer.findById(idGC)
        const objectId=new mongoose.Types.ObjectId(idGroup)
        if(groupContainer.groups.includes(objectId)){
            var group= await this.groupModel.findById(objectId)

        }
        return groupContainer.studentNumber=== group.studentList.length
     }

     async remouveStudentFromGroup(idStudent:string,idGC:string,idGroup:string){
        const groupContainer= await this.groupContainer.findById(idGC)
        const objectId=new mongoose.Types.ObjectId(idGroup)
        if(groupContainer.groups.includes(objectId)){
            const group= await this.groupModel.findById(objectId)
            let index=group.studentList.indexOf(idStudent)
               
                console.log(index)
            if(index !== -1){
                group.studentList.splice(index,1)
            }
            //add api that will delete the group id from in document student in auth service
            await group.save()
            return group;
        }
     

     }
     
     async deleteGroups(){
        return await this.groupModel.deleteMany()
     }
     async deleteGroupsContainer(){
        return await this.groupContainer.deleteMany()
     }
     
     //remouve student from the group

     async getGroupDetailOfSTudent(idStudent:string){
        try{
            const groups=await this.groupModel.find({
                studentList:idStudent
            })
            return groups
        }catch(err){
            console.log(err)
        }
     }

    async getGroupsContainerOfStudent(idStudent:string){
        try {
            const groups = await this.groupModel.find({ studentList: idStudent });
            const groupsContainer = await Promise.all(groups.map(async (e) => {
                const gp = await this.groupContainer.findById(e.groupContainer);
                return gp;
            }));
            return groupsContainer;
        } catch (err) {
            console.log(err);
        }
        
    }

    //returne the planing for a student
    async getStudentPlaning(idStudent:string){
        try{
        const groups = await this.groupModel.find({ studentList: idStudent });
        const palning=[]
        groups.forEach((g)=>{
            g.planing.forEach((p)=>{
                p.dates.forEach((t)=>{
                    palning.push(t)
                })
                
            })
        })
        return palning

        }catch(err){
            console.log(err)
        }
    }

    //returne the groups for specifi session and specic prof
    async getGropsOfGcBYIdProf(idGc:string){
        try{
        
        const groups=await this.groupModel.find({groupContainer:idGc})
        return groups

        }catch(err){
            console.log(err)
        }
    }
    
    
}
    
  