import { Body, Controller, Get, Req, HttpStatus, Param, Post, Res, UseGuards, Request, Put, Delete } from '@nestjs/common';
import { SessionService } from './session.service';
import { CreateGcDto } from 'src/Dto/createGD.dto';
import { Response } from 'express';
import axios from 'axios';
import { AuthGuard } from 'src/auth/auth.gurad';
import { ProfGuard } from 'src/auth/prof.gurad';
import { AdminGuard } from 'src/auth/admin.gurad';
import { getgroups } from 'process';
import { ProducerService } from 'src/kafka/producer/producer.service';
@Controller('session')
export class SessionController {
    constructor(private readonly groupCntainerService: SessionService,
        private readonly producerService: ProducerService
    ) { }

    @Get('/allGroupsContainer')
    async getAllGroupContainers() {
        return await this.groupCntainerService.getAllGroupContainers()
    }

    @Get('/groupContainer/:idGC')
    async getAllGroupContainerById(@Param("idGC") idGC: string) {
        return await this.groupCntainerService.getGroupCOntainerById(idGC)
    }




    //cretae a session for cem student
    @Post('/createGroupContainerCem')
    @UseGuards(AuthGuard, ProfGuard)
    async createGroupContainerCem(@Body() CreateGcDto: CreateGcDto,  @Request() request) {

        try {

            const gorupContainer = await this.groupCntainerService.findGroupContainer(request.prof.id, CreateGcDto)
            if (gorupContainer) {
                return "vous ne pouvez pas créer deux session avec les meme information"
            } else {
                const createGc = await this.groupCntainerService.createGroupContainerCem(request.prof.id, CreateGcDto)
                await this.producerService.produce({
                    topic: 'groupContainer_created_event',
                    messages: [
                        {
                            value: JSON.stringify({
                                createGc

                            })
                        }
                    ]
                })
                await this.producerService.produce({
                    topic: 'session_notification_created',
                    messages: [
                        {
                            value: JSON.stringify({
                                createGc

                            })
                        }
                    ]
                })

                return  createGc
            }
        } catch (err) {
            console.log(err)
        }

    }

    //cretae a session for lucée student
    @Post('/createGroupContainerLycee')
    @UseGuards(AuthGuard, ProfGuard)
    async createGroupContainerLycee(@Body() CreateGcDto: CreateGcDto, @Res() res: Response, @Request() request) {
        try {
            //roles.data.id this represent the prof id
            const gorupContainer = await this.groupCntainerService.findGroupContainer(request.prof.id, CreateGcDto)
            if (gorupContainer) {
                return res.status(HttpStatus.CONFLICT).json("vous ne pouvez pas créer deux session avec les meme information")
            } else {
                const createGc = await this.groupCntainerService.createGroupContainerLycee(request.prof.id, CreateGcDto)
                await this.producerService.produce({
                    topic: 'groupContainer_created_event',
                    messages: [
                        {
                            value: JSON.stringify({
                                createGc

                            })
                        }
                    ]
                })
                await this.producerService.produce({
                    topic: 'session_notification_created',
                    messages: [
                        {
                            value: JSON.stringify({
                                createGc

                            })
                        }
                    ]
                })
                return res.status(HttpStatus.CREATED).json(createGc)
            }

        } catch (err) {
            console.log(err)
        }


    }


    

    

    //validate group container
    //add axios in this part
    @Post("validateGroupContainer/:idGC")
    //@UseGuards(AuthGuard,AdminGuard)
    async validateGroupContainer(@Param('idGC') idGC: string, @Res() res: Response) {
        try {
            const validateGC = await this.groupCntainerService.validateGroupContainer(idGC)
            await this.producerService.produce({
                topic: 'validate_group_2',
                messages: [
                    {
                        value: JSON.stringify({
                            validateGC
                        })
                    }
                ]
            })

            await this.producerService.produce({
                topic: 'validate_session_notification',
                messages: [
                    {
                        value: JSON.stringify({
                            validateGC
                        })
                    }
                ]
            })

            if (!validateGC || !validateGC._id) {
                throw new Error("Invalid Group Container");
            }
    
            // Send request to create forum
            const forumResponse = await axios.post(`http://localhost:3030/forum/createforum/${validateGC._id}`);
            console.log("Forum Response:", forumResponse.data);
    
            // Send request to create chat group
            const chatGroupResponse = await axios.post(`http://localhost:3030/messagerie/${validateGC._id}/chatgroups`);
            console.log("Chat Group Response:", chatGroupResponse.data);
            return res.status(HttpStatus.OK).json(validateGC)
        } catch (err) {
            console.log(err)
        }
    }

    //get validate groups
    @Get("/getValidateGroup")
    async getAllValidateGC(@Res() res: Response) {
        try {
            const groupContainers = await this.groupCntainerService.getValidateGroup()
            res.status(HttpStatus.OK).json(groupContainers)

        } catch (err) {
            console.log(err)
        }
    }

    //get all group conatiner for a specific prof validate one
    //this will use to show this data in prof dashbord
    @Get('/groupContainerForProf')
    @UseGuards(AuthGuard, ProfGuard)
    async groupContainerByProf(@Request() request, @Res() res: Response) {
        try {
            const groupContainers = await this.groupCntainerService.groupContainerByProf(request.prof.id)
            return res.status(HttpStatus.OK).json(groupContainers)
        } catch (err) {
            console.log(err)
        }
    }

    @Delete('/deletegc/:idGC')
    async deleteGroupContainer(@Param('idGC') idGC: string, @Res() res: Response) {
        try {
            const groupsNotEmpty = await this.groupCntainerService.getGroups(idGC);
            if (groupsNotEmpty) {
                return res.status(HttpStatus.BAD_REQUEST).json("tu ne peux pas supprimer de cet session car il conatine des group avec des etudaint");
            }
            const groupContainer = await this.groupCntainerService.deleteGc(idGC);

            return res.status(HttpStatus.OK).json(groupContainer);


        } catch (err) {
            console.log(err)
        }
    }


    @Put('/updategc/:idGC')
    async updateGroupContainer(@Param('idGC') idGC: string, @Body() createGC: CreateGcDto, @Res() res: Response) {
        try {
            const groupsNotEmpty = await this.groupCntainerService.getGroups(idGC);
            if (groupsNotEmpty) {
                return res.status(HttpStatus.BAD_REQUEST).json("tu ne peux pas modifer les information de cet session car il conatine des group avec des etudaint");
            }
            const groupContainer = await this.groupCntainerService.updateGc(idGC, createGC);

            return res.status(HttpStatus.OK).json(groupContainer);

        } catch (err) {
            console.log(err)
        }
    }

    @Get('/sessiongroups/:idGC')
    async getAllTHeGroupOfSession(@Param('idGC') idGC: string, @Res() res: Response) {
        try {
            const groups = await this.groupCntainerService.getGroupOfSession(idGC);


            return res.status(HttpStatus.OK).json(groups);

        } catch (err) {
            console.log(err)
        }
    }


    @Delete('refuseSession/:idS')
    async refuseSession(@Param('idS') idS: string) {
        try {
            //res.status(HttpStatus.OK).json("the session refused");
            await this.producerService.produce({
                topic: 'refuse_session_2',
                messages: [
                    {
                        value: JSON.stringify({
                            idS: idS
                        })
                    }
                ]
            })
            await this.producerService.produce({
                topic: 'session_refuse_notification',
                messages: [
                    {
                        value: JSON.stringify({
                            idS: idS
                        })
                    }
                ]
            })
            return await this.groupCntainerService.deleteSession(idS)
        } catch (err) {
            console.log(err)
        }
    }



    @Get('sessionNumber')
    async sessionNumber() {
        try {


            return await this.groupCntainerService.sessionNumber()


        } catch (err) {
            console.log(err)
        }
    }

    @Get('sessionNumberForProf')
    @UseGuards(AuthGuard,ProfGuard)
    async getPaymentStudent(@Request() request){
    try{
        return await this.groupCntainerService.sessionNumberForProf(request.prof.id)
    }catch(err){
        console.log(err)
    }

}

@Get('sessionNumberForProf')
async numberOfGroup(){
try{
    return await this.groupCntainerService.getNumberOfGroup()
}catch(err){
    console.log(err)
}

}
@Get('profit')
async getAllTheProfit(){
    try{
        return await this.groupCntainerService.getAllProfit()
    }catch(err){
        console.log(err)
    }
    
    }


}

