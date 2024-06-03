import { Body, Controller, Get, Param } from '@nestjs/common';
import { GroupContainerService } from './group-container.service';
import { fillterDto } from 'src/dto/fillter.dto';

@Controller('group-container')
export class GroupContainerController {
    constructor(private groupContainerService:GroupContainerService){}
    @Get('getgc')
    async getGroupContainer(@Body() fillterDto:fillterDto){
        try{
            return this.groupContainerService.fillter(fillterDto)
        }catch(err){
            console.log(err)
        }
    }

    @Get('getGroupcontainer')
    async getGroupConatinerWithProfDetail(){
        try{
            return await this.groupContainerService.getGroupContainer()
        }catch(err){
            console.log(err)
        }
    }

    @Get('getGroupcontainerwithId/:idGc')
    async getGroupConatinerWithProfDetailById(@Param('idGc') idGC:string){
        try{
            return await this.groupContainerService.getGroupContainerById(idGC)
        }catch(err){
            console.log(err)
        }
    }


}


