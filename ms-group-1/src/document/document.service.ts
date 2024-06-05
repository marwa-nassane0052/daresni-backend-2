import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import mongoose, { Model } from 'mongoose';
import { Group } from 'src/Entity/group.schema';
import { GroupContainer } from 'src/Entity/groupContainer';

@Injectable()
export class DocumentService {
    constructor(@InjectModel(Group.name) private groupModel:Model<Group>,
    @InjectModel(GroupContainer.name) private groupContainer:Model<GroupContainer>
){}

async addPathFileInDB(idGC:string,idGroup:string,path:string){
    const groupContainer=await this.groupContainer.findById(idGC)
    const objectId=new mongoose.Types.ObjectId(idGroup)
    if(groupContainer.groups.includes(objectId)){
        const group=await this.groupModel.findById(idGroup)
        group.document.push(path)
        await group.save()
        return group
    }
}
async getDocuments(idGC:string,idGroup:string){
    const groupContainer=await this.groupContainer.findById(idGC)
  
        const group=await this.groupModel.findById(idGroup)
        return group.document
    
    
}
}
