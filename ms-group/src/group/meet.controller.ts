import { Controller, Get, Req, Res } from "@nestjs/common";
import { google } from 'googleapis';
import { Response, Request } from "express";
import { v4 as uuidv4 } from 'uuid';


@Controller('')
export class MeetController{
    private auth:any
    constructor(){
        this.auth=new google.auth.OAuth2(
          process.env.client_id,
          process.env.client_secret,
          process.env.redirect_uris
        )

    }

    @Get('/testmmm')
    getMessage( @Res() res:Response){
        return res.json('hiiiiii')
    }

    @Get('/google')
    getUrl(@Res() res:Response){
     const SCOPES = ['https://www.googleapis.com/auth/calendar'];

    const url=this.auth.generateAuthUrl({
      access_type:"offline",
      scope:SCOPES
      })
    return res.redirect(url)
  }
  @Get('/google/redirect')
  async redirect(@Req() req:Request,@Res() res:Response){
    const code=req.query.code
    const {tokens}=await this.auth.getToken(code)
    this.auth.setCredentials(tokens)
    console.log(tokens)
    return res.json("its work")
  }

  @Get('addDate')
  async scheduls(@Res() res:Response){

    const datesToAdd = [
        {
            startDateTime: '2024-05-25T19:30:00',
            endDateTime: '2024-05-28T20:30:00',
            info:'math cours '
          },
        {
            startDateTime: '2024-05-24T19:30:00',
            endDateTime: '2024-05-28T20:30:00',
            info:'physics cours'
          },
        {
          startDateTime: '2024-05-29T19:30:00',
          endDateTime: '2024-05-30T20:30:00',
          info:'sience cours'

        },
        {
          startDateTime: '2024-04-30T19:30:00',
          endDateTime: '2024-05-05T20:30:00',
          info:'physics cours'

        },
        
      ];

    const calender=google.calendar({
      version:'v3',
      auth:process.env.AUTH_SECRET
    })
    datesToAdd.forEach(date=>{
        calender.events.insert({
            calendarId: 'primary',
            auth:this.auth,
            conferenceDataVersion:1,
              requestBody: {
                attendees: [{ email: 'm.nassane@esi-sba.dz' }],
                summary:date.info,
                description: 'new meet',
                
                start: {
                  dateTime: date.startDateTime,
                  timeZone: 'CET',
                },
                end: {
                  dateTime: date.endDateTime,
                  timeZone: 'CET',
                },
                conferenceData:{
                    createRequest:{
                    requestId:uuidv4(),
                  }
                  
                }
              },
          })

    })
    
    return res.send(" finalyyyyy i m ork ")
  }

}