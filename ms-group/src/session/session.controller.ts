import { Body, Controller, Get,Req, HttpStatus, Param, Post, Res, UseGuards ,Request} from '@nestjs/common';
import { SessionService } from './session.service';
import { CreateGcDto } from 'src/Dto/createGD.dto';
import { Response } from 'express';
import axios from 'axios';
import { AuthGuard } from 'src/auth/auth.gurad';
import { ProfGuard } from 'src/auth/prof.gurad';
import { AdminGuard } from 'src/auth/admin.gurad';
@Controller('session')
export class SessionController {
    constructor(private readonly groupCntainerService:SessionService){}

    @Get('/allGroupsContainer')
    async getAllGroupContainers(){
        return await this.groupCntainerService.getAllGroupContainers()
    }
     
    //cretae a session for cem student
    @Post('/createGroupContainerCem')
    @UseGuards(AuthGuard,ProfGuard)
    async createGroupContainerCem(@Body() CreateGcDto:CreateGcDto,@Res() res:Response,@Request() request){
       
           try{ 
                const gorupContainer=await this.groupCntainerService.findGroupContainer(request.prof,CreateGcDto)
                if(gorupContainer){
                    return res.status(HttpStatus.CONFLICT).json("vous ne pouvez pas créer deux session avec les meme information")
                }else{
                    const createGc= await this.groupCntainerService.createGroupContainerCem(request.prof,CreateGcDto)
                   return res.status(HttpStatus.CREATED).json(createGc)
                }
             }catch(err){
                console.log(err)
             }
        
    }

    //cretae a session for lucée student
    @Post('/createGroupContainerLycee')
    @UseGuards(AuthGuard,ProfGuard)
    async createGroupContainerLycee(@Body() CreateGcDto:CreateGcDto,@Res() res:Response,@Request() request){
        try{
             //roles.data.id this represent the prof id
            const gorupContainer=await this.groupCntainerService.findGroupContainer(request.prof,CreateGcDto)
            if(gorupContainer){
                    return res.status(HttpStatus.CONFLICT).json("vous ne pouvez pas créer deux session avec les meme information")
            }else{
                    const createGc= await this.groupCntainerService.createGroupContainerLycee(request.prof,CreateGcDto)
            return res.status(HttpStatus.CREATED).json(createGc)
        }

        }catch(err){
            console.log(err)
        }

       
    }
       
    //validate group container
    @Post("/validateGroupContainer/:idGC")
    @UseGuards(AuthGuard,AdminGuard)
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
    
     //get all group conatiner for a specific prof validate one
     //this will use to show this data in prof dashbord
     @Get('/groupContainerForProf')
     @UseGuards(AuthGuard,ProfGuard)
     async groupContainerByProf(@Request() request,@Res() res:Response){
        try{
            const groupContainers=await this.groupCntainerService.groupContainerByProf(request.prof)
            return res.status(HttpStatus.OK).json(groupContainers)
        }catch(err){
            console.log(err)
        }
    }
     
}