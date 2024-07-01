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
    async uploadDocument(@Body()requireData:{idGroup:string} ,@UploadedFile() file: Express.Multer.File){
      try{
        if (!file) {
            throw new HttpException('No file uploaded', HttpStatus.BAD_REQUEST);     
        }
        const filePath = `./upload/${file.filename}`;
        await this.documentService.addPathFileInDB(requireData.idGroup,filePath)
        return filePath
      }catch(err){
        console.log(err)
      }
       
    }

    //get files
    @Get('/getDocuments/:idGroup')
    async getDocuments(@Param('idGroup') idGroup:string){
      try{
        
        const documentsPath=await this.documentService.getDocuments(idGroup)
       
          const documents=[]
          documentsPath.forEach((e)=>{
            const absolutePath = path.resolve(String(e));
            documents.push(absolutePath)
          })
          return documents

      }catch(err){
        console.log(err)
      }
    }
    
  
  @Get('fileContent/:filename')
  async getFileContent(@Param('filename') filename: string, @Res() res: Response) {
    try {
      // Construct the absolute file path
      const filePath = path.resolve(`C:\\Users\\pc\\Desktop\\projet3\\daresni-backend-2\\ms-group-1\\upload\\${filename}`);

   
    

      // Send the file
      res.sendFile(filePath);
    } catch (err) {
      console.error(err);
      
    }
  }
}

