import { Body, Controller, Delete, Get,HttpStatus,Param,Post, Req, Request, Res, UseGuards } from '@nestjs/common';
import { GroupService } from './group.service';
import {  CreateGroupDto} from 'src/Dto/createGroup.dto';
import { Response } from 'express';
import axios from 'axios';
import { AuthService } from 'src/auth/auth.service';
import { AuthGuard } from 'src/auth/auth.gurad';
import { AdminGuard } from 'src/auth/admin.gurad';
import { ProfGuard } from 'src/auth/prof.gurad';

@Controller('group')
export class GroupController {
    constructor(private readonly groupService:GroupService){}
   
   //create group in specific group container
    @Post('/createGroup/:idGC')
    @UseGuards(AuthGuard,ProfGuard)
    async createGroup(@Request() request, @Param('idGC') idGC:string,@Body()creategroupDto:CreateGroupDto,@Res() res:Response){
        const existingGroup=await this.groupService.findGroupInConatiner(idGC,creategroupDto.groupName)
        const existingStartingDates=await this.groupService.getDates(request.prof)

        const dates=[]
        creategroupDto.startingDate.forEach((e)=>{
            dates.push(new Date(e))
        })
        const matchingValue = this.groupService.findMatchingValue(existingStartingDates,dates);
        
        
        if(existingGroup){
            return res.status(HttpStatus.CONFLICT).json(`tu ne pêut pas créer deux groupe avec le même nom  ${creategroupDto.groupName}`)
        }else if(matchingValue.length >0){
            return res.status(HttpStatus.CONFLICT).json(`tu ne pêut pas créer deux groupe en même temps ${matchingValue}`)
        }
        const createdGroup= await this.groupService.createGroup(idGC,creategroupDto)
        return res.status(HttpStatus.CREATED).json(createdGroup)

    }
   
    //add student in group
    @Post('/addStudent')
    async addStudentToGRoup(@Body() requireData:{idStudent:string,idGC:string,idGroup:string},@Res() res:Response){
        try{
            const isGroupComplete=await this.groupService.getStudentNumberIngroup(requireData.idGC,requireData.idGroup)
            if(isGroupComplete){
               return res.status(HttpStatus.FORBIDDEN).json({msg:"ce groupe est complete tu ne peux pas ajouter d'autre etudiant"})
            }
            const resulte= await this.groupService.addStudent(requireData.idStudent,requireData.idGC,requireData.idGroup)
          
            return res.status(HttpStatus.ACCEPTED).json(resulte)
            /* return res.status(HttpStatus.OK).json("etudiant a été ajouté dans  ce group group avec succès")*/
            
        }catch(err){
            console.log(err)
        }
    }
    
    //remouve studnet from group
    @Delete('removeStudent')
    async remouveStudentFromGroup(@Body() requireData:{idStudent:string,idGC:string,idGroup:string},@Res() res:Response){
        try{
           const group= await this.groupService.remouveStudentFromGroup(requireData.idStudent,requireData.idGC,requireData.idGroup)
           return res.status(HttpStatus.OK).json(group)
          /* return res.status(HttpStatus.OK).json("etudiant supprime a partire de ce group avec succès")*/
        }catch(err){
            console.log(err)
        }
    }
    
    //returen by id student the the detila of its groups
    @Get("/studentGroup/:idStudent")
    async getGroupsOfStudent(@Param("idStudent") idStudent:string,@Res() res:Response){
        try{
            const studentGroups=await this.groupService.getGroupDetailOfSTudent(idStudent)
            return res.status(HttpStatus.OK).json(studentGroups)

        }catch(err){
            console.log(err)
        }
    }

    //returne the session of the student
    @Get("/studentGroupContainer/:idStudent")
    async getGroupsContainerOfStudent(@Param("idStudent") idStudent:string,@Res() res:Response){
        try{
            const studentGroupsContainer=await this.groupService.getGroupsContainerOfStudent(idStudent)
            return res.status(HttpStatus.OK).json(studentGroupsContainer)

        }catch(err){
            console.log(err)
        }
    }

    //returen the planing of student
    @Get("/studentPlaning/:idStudent")
    async getPlaningOfStudent(@Param("idStudent") idStudent:string,@Res() res:Response){
        try{
            const studentPlaning=await this.groupService.getStudentPlaning(idStudent)
            return res.status(HttpStatus.OK).json(studentPlaning)

        }catch(err){
            console.log(err)
        }
    }
  
    //returne a planing for a specific prof
    @Get("/profPlaning/:idProf")
    async getPlaningOfProf(@Param("idProf") idStudent:string,@Res() res:Response){
        try{
            const profPlaning=await this.groupService.getDates(idStudent)
            return res.status(HttpStatus.OK).json(profPlaning)

        }catch(err){
            console.log(err)
        }
    }

//in prof dashbord to returne for each session the list of groups
    
@Get("/profGroup/:idProf")
async getGroupsOfSessionForProf(@Param("idProf") idStudent:string,@Res() res:Response){
    try{
        const groups=await this.groupService.getGropsOfGcBYIdProf(idStudent)
        return res.status(HttpStatus.OK).json(groups)

    }catch(err){
        console.log(err)
    }
}



@Get('/test')
@UseGuards(AuthGuard,ProfGuard)
async communication(@Request() request){
   return this.groupService.getMessage(request.prof)
}



}
