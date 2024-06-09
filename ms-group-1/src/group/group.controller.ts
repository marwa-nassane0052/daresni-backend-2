import { Body, Controller, Delete, Get,HttpStatus,Param,Post, Req, Request, Res, UseGuards } from '@nestjs/common';
import { GroupService } from './group.service';
import {  CreateGroupDto} from 'src/Dto/createGroup.dto';
import {   Response } from 'express';
import { AuthGuard } from 'src/auth/auth.gurad';
import { ProfGuard } from 'src/auth/prof.gurad';
import { StudentGurad } from 'src/auth/student.gurad';
import { ProducerService } from 'src/kafka/producer/producer.service';

@Controller('group')
export class GroupController {
   

    constructor(private readonly groupService:GroupService,
               private readonly producerService:ProducerService        
        ){
        
    }


   

   
   //create group in specific group container
    @Post('/createGroup/:idGC')
    @UseGuards(AuthGuard,ProfGuard)
    async createGroup(@Request() request, @Param('idGC') idGC:string,@Body()creategroupDto:CreateGroupDto,@Res() res:Response){
        const existingGroup=await this.groupService.findGroupInConatiner(idGC,creategroupDto.groupName)
        const existingStartingDates=await this.groupService.getDates(request.prof.id)

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
        await this.producerService.produce({
            topic:'group_cretaed',
                messages:[
                    {
                        value:JSON.stringify({
                            createdGroup
                            
                        })
                    }
                ]
        })
        return res.status(HttpStatus.CREATED).json(createdGroup)

    }
   
    //add student in group
    @Post('/addStudent')
    @UseGuards(AuthGuard,StudentGurad)
    async addStudentToGRoup(@Body() requireData:{idGC:string,idGroup:string},@Request() request){

        try{
            const idStudent=request.student.id
           
            const resulte= await this.groupService.addStudent(idStudent,requireData.idGC,requireData.idGroup)
          
            return resulte
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
    @Get("/studentGroups")
    @UseGuards(AuthGuard,StudentGurad)
    async getGroupsOfStudent(@Request() request,@Res() res:Response){
        try{
            const idStudent=request.student.id
           
            
            const studentGroups=await this.groupService.getGroupDetailOfSTudent(idStudent)
            return res.status(HttpStatus.OK).json(studentGroups)

        }catch(err){
            console.log(err)
        }
    }

    //returne the session of the student
    @Get("/studentGroupContainers")
    @UseGuards(AuthGuard,StudentGurad)
    async getGroupsContainerOfStudent(@Request() request,@Res() res:Response){
        try{
            const idStudent=request.student.id
            const studentGroupsContainer=await this.groupService.getGroupsContainerOfStudent(idStudent)
            return res.status(HttpStatus.OK).json(studentGroupsContainer)

        }catch(err){
            console.log(err)
        }
    }

    //returen the planing of student (by id student)
    @Get("/studentPlaning")
    @UseGuards(AuthGuard,StudentGurad)
    async getPlaningOfStudent(@Request() request,@Res() res:Response){
        try{
            const idStudent=request.student.id
            const studentPlaning=await this.groupService.getStudentPlaning(idStudent)
            return res.status(HttpStatus.OK).json(studentPlaning)

        }catch(err){
            console.log(err)
        }
    }
  
    //returne a planing for a specific prof(by id Prof)
    @Get("/profPlaning")
    @UseGuards(AuthGuard,ProfGuard)
    async getPlaningOfProf(@Request() request,@Res() res:Response){
        try{
            const idProf=request.prof.id
            const profPlaning=await this.groupService.getProfPlaning(idProf)
            return res.status(HttpStatus.OK).json(profPlaning)

        }catch(err){
            console.log(err)
        }
    }

//in prof dashbord to returne for each session the list of groups
@Get("/profGroup/:idGC")
@UseGuards(AuthGuard,ProfGuard)
async getGroupsOfSessionForProf(@Param("idGC") idGC:string,@Res() res:Response){
    try{
        const groups=await this.groupService.getGropsOfGcBYIdProf(idGC)
        return res.status(HttpStatus.OK).json(groups)

    }catch(err){
        console.log(err)
    }
}



@Get('/test')
@UseGuards(AuthGuard,StudentGurad)
async communication(@Request() request){
   return this.groupService.getMessage(request.student.email,request.student.id)
}

@Get('/text2/:name/:age')
async test2(@Param("name") name:string,@Param("age") age:Number){
    await this.producerService.produce({
        topic:'group_cretaed',
        messages:[
            {
                value:JSON.stringify({
                    groupName:name,
                    studentNumber:age
                   
                })
            }
        ]
    })
    return  name
}

@Get('/text3/:name/:email')
async test3(@Param("name") name:string,@Param("email") email:string){
    await this.producerService.produce({
        topic:'user_cretaed',
        messages:[
            {
                value:JSON.stringify({
                    user:name,
                    email:email

                })
            }
        ]
    })
    return  name
}

@Get('studentGroup/:idG')
async getStudentGroup(@Param('idG') idG:string){
    try{
        return await this.groupService.getStudentOfGroup(idG)
    }catch(err){
        console.log(err)
    }

}



@Get('studentPayment')
@UseGuards(AuthGuard,ProfGuard)
async getPaymentStudent(@Request() request){
    try{
        return await this.groupService.getPaymentStudent(request.prof.id)
    }catch(err){
        console.log(err)
    }

}

@Get('allPayment')
async getAllPayment(){
    try{
        return await this.groupService.getAllPayment()
    }catch(err){
        console.log(err)
    }

}

@Get('groupInfo/:id')
async getGroupInfoBYId(@Param('id') id:string){
    try{
        return await this.groupService.getGroupById(id)
    }catch(err){
        console.log(err)
    }

}

@Get('msg')
async returnResponse(){
    try{
        return await this.groupService.getMessageErrore()
    }catch(err){
        console.log(err)
    }

}


}
