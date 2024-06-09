import { Controller,Get, Param, Post } from '@nestjs/common';
import { SessionNotificationService } from './session-notification.service';

@Controller('session-notification')
export class SessionNotificationController 
{
    constructor(private readonly sesseionService:SessionNotificationService) {}
    @Get('/adminNotification')
    async getNotification(){
        try{
            return await this.sesseionService.getAdminNotification()
        }catch(err){
            console.log(err)
        }
    }

    @Get('/profNotification/:email')
    async getProfNotification(@Param('email') email:string){
        try{
            return await this.sesseionService.getProfNotification(email)
        }catch(err){
            console.log(err)
        }
    }


}
