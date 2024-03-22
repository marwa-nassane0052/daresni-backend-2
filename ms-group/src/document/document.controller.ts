import { Body, Controller, Get, HttpException, HttpStatus, Param, Post, Res, UploadedFile, UseInterceptors } from '@nestjs/common';
import { DocumentService } from './document.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import * as path from 'path';
import { Response } from 'express';

@Controller('document')
export class DocumentController {
    constructor(private readonly documentService:DocumentService){}


    @Post('/addDocument')
    @UseInterceptors(FileInterceptor('doc',{
        storage: diskStorage({
            destination:'./upload',
            filename(req, file, cb) {
                const filename: string = path.parse(file.originalname).name.replace(/\s/g, '')
                const extention: string = path.parse(file.originalname).ext;
                
                cb(null, `${filename}${extention}`);
            },
        })     
    }))
    async uploadDocument(@Body()requireData:{idGC:string,idGroup:string} ,@UploadedFile() file: Express.Multer.File){
      try{
        if (!file) {
            throw new HttpException('No file uploaded', HttpStatus.BAD_REQUEST);     
        }
        const filePath = `./upload/${file.filename}`;
        await this.documentService.addPathFileInDB(requireData.idGC,requireData.idGroup,filePath)
        return filePath
      }catch(err){
        console.log(err)
      }
       
    }

    //get files
    @Get('/getDocuments')
    async getDocuments(@Body()requireData:{idGC:string,idGroup:string},@Res() res:Response){
      try{
        
        const documentsPath=await this.documentService.getDocuments(requireData.idGC,requireData.idGroup)
       
          const documents=[]
          documentsPath.forEach((e)=>{
            const absolutePath = path.resolve(String(e));
            documents.push(absolutePath)
          })
          return res.status(HttpStatus.FOUND).json(documents)

      }catch(err){
        console.log(err)
      }
    }
    @Get('fileContant')
    async getFileCOntant(@Body() data:{ path:string},@Res() res:Response){
      return res.sendFile(data.path)
    
    }

}

