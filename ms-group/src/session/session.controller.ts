import { Body, Controller, Get, HttpStatus, Param, Post, Res } from '@nestjs/common';
import { SessionService } from './session.service';
import { CreateGcDto } from 'src/Dto/createGD.dto';
import { Response } from 'express';

@Controller('session')
export class SessionController {
    constructor(private readonly groupCntainerService:SessionService){}

    @Get('/allGroupsContainer')
    async getAllGroupContainers(){
        return await this.groupCntainerService.getAllGroupContainers()
    }
     
    //cretae a session for cem student
    @Post('/createGroupContainerCem/:profId')
    async createGroupContainerCem(@Param('profId') profId:string,@Body() CreateGcDto:CreateGcDto,@Res() res:Response){
        const gorupContainer=await this.groupCntainerService.findGroupContainer(profId,CreateGcDto)
        if(gorupContainer){
            return res.status(HttpStatus.CONFLICT).json("vous ne pouvez pas créer deux session avec les meme information")
        }else{
            const createGc= await this.groupCntainerService.createGroupContainerCem(profId,CreateGcDto)
            return res.status(HttpStatus.CREATED).json(createGc)
        }
    }

    //cretae a session for lucée student
    @Post('/createGroupContainerLycee/:profId')
    async createGroupContainerLycee(@Param('profId') profId:string,@Body() CreateGcDto:CreateGcDto,@Res() res:Response){
        const gorupContainer=await this.groupCntainerService.findGroupContainer(profId,CreateGcDto)
        if(gorupContainer){
            return res.status(HttpStatus.CONFLICT).json("vous ne pouvez pas créer deux session avec les meme information")
        }else{
            const createGc= await this.groupCntainerService.createGroupContainerLycee(profId,CreateGcDto)
            return res.status(HttpStatus.CREATED).json(createGc)
        }
    }
       
    //validate group container
    @Post("/validateGroupContainer/:idGC")
    async validateGroupContainer(@Param('idGC') idGC:string,@Res() res:Response){
        try{
            const validateGC=await this.groupCntainerService.validateGroupContainer(idGC)
            return res.status(HttpStatus.OK).json(validateGC)

        }catch(err){
            console.log(err)
        }
    }
    
    //get validate groups
    @Get("/getValidateGroup")
    async getAllValidateGC(@Res() res:Response){
        try{
            const groupContainers=await this.groupCntainerService.getValidateGroup()
            res.status(HttpStatus.OK).json(groupContainers)

        }catch(err){
            console.log(err)
        }
    }
     //get all group conatiner for a specific prof validated one
     @Get('/groupContainer/:idProf')
     async groupContainerByProf(@Param('idProf') idProf:string,@Res() res:Response){
        try{
            const groupContainers=await this.groupCntainerService.groupContainerByProf(idProf)

            return res.status(HttpStatus.OK).json(groupContainers)

        }catch(err){
            console.log(err)
        }
    }
     
}