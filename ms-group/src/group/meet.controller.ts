import { Controller, Get, Req, Res, UseGuards } from "@nestjs/common";
import { google } from 'googleapis';
import { Response, Request } from "express";
import { v4 as uuidv4 } from 'uuid';
import { AuthGuard } from "src/auth/auth.gurad";
import { ProfGuard } from "src/auth/prof.gurad";
import { GroupService } from "./group.service";
import { StudentGurad } from "src/auth/student.gurad";


@Controller('')
export class MeetController{
    private auth:any
    constructor(private readonly groupService:GroupService){
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

  @Get('addDateProf')
  @UseGuards(AuthGuard,ProfGuard)
  async scheduls(@Res() res:Response,@Req() request){

    const datesToAdd =await this.groupService.getProfPlaning(request.prof.id)
    const calender=google.calendar({
      version:'v3',
      auth:process.env.AUTH
    })
    datesToAdd.forEach(date=>{
        calender.events.insert({
            calendarId: 'primary',
            auth:this.auth,
            conferenceDataVersion:1,
              requestBody: {
                attendees: [{ email: request.prof.email }],
                summary:date.info,
                description: 'new meet',
                
                start: {
                  dateTime: date.StartingDate,
                  timeZone: 'CET',
                },
                end: {
                  dateTime:date.endingDate,
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
    
    return res.send(" les date sont enregistrées avec succès dans votre calendrier")
  }

  @Get('addDateStudent')
  @UseGuards(AuthGuard,StudentGurad)
  async schedulsStudent(@Res() res:Response,@Req() request){

    const datesToAdd =await this.groupService.getStudentPlaning(request.student.id)
    const calender=google.calendar({
      version:'v3',
      auth:process.env.AUTH
    })
    datesToAdd.forEach(date=>{
        calender.events.insert({
            calendarId: 'primary',
            auth:this.auth,
            conferenceDataVersion:1,
              requestBody: {
                attendees: [{ email: request.student.email }],
                summary:date.info,
                description: 'new meet',
                
                start: {
                  dateTime: date.StartingDate,
                  timeZone: 'CET',
                },
                end: {
                  dateTime:date.endingDate,
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
    
    return res.send("les date sont enregistrées avec succès dans votre calendrier")
  }

}