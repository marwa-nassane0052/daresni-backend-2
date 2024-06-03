import { Body, Controller, Get } from '@nestjs/common';
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
}


