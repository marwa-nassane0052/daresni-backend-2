import {
  Body,
  Controller,
  Delete,
  ForbiddenException,
  Get,
  Param,
  Post,
  Req,
  Res,
  UploadedFile,
  UploadedFiles,
  UseInterceptors,
} from '@nestjs/common';
import { Request } from 'express';
import { UserDTO } from './DTO/User.dto';
import { AuthService } from './auth.service';
import { LoginDTO } from './DTO/login.dto';
import { ProfDTO } from './DTO/Prof.dto';
import { StudentDTO } from './DTO/Student.dto';
import { ProducerService } from 'src/kafka/producer/producer.service';
import { FileFieldsInterceptor, FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';
import { use } from 'passport';
import { diskStorage } from 'multer';
import * as path from 'path';
import { Response } from 'express';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService,private readonly producerService:ProducerService) {}
//signUp prof
  @Post('signup/prof')
  @UseInterceptors(FileFieldsInterceptor([
    { name: 'Cv', maxCount: 1 },
    { name: 'picture', maxCount: 1 }
  ], {
    storage: diskStorage({
      destination: './uploads',
      filename: (req, file, cb) => {
        const filename: string = path.parse(file.originalname).name.replace(/\s/g, '');
        const extension: string = path.parse(file.originalname).ext;
        cb(null, `${filename}${extension}`);
      },
    }),
  }))
  async signupProf(
    @Body() createUserDto: UserDTO,
    @Body() profileDto: ProfDTO,
    @UploadedFiles() files: { Cv?: Express.Multer.File[], picture?: Express.Multer.File[] }

  ) {


    const cvFile = files.Cv?.[0];
    const pictureFile = files.picture?.[0];
    const cvPath = `./upload/${cvFile.filename}`;
    const picturePath = `./upload/${pictureFile.filename}`;


    const createdProf=await this.authService.signupProf(createUserDto, profileDto,cvPath,picturePath);
    await this.producerService.produce({
      topic:'user_created',
      messages:[
        {
            value:JSON.stringify({
              id_prof:createdProf.prof.user,
              name:createdProf.prof.name,
              familyname:createdProf.prof.familyname,
              email:createdProf.prof.email,
              phone: createdProf.prof.phone               
            })
        }
    ]
    })
    await this.producerService.produce({
      topic:'prof_created_notification_2',
      messages:[
        {
            value:JSON.stringify({
              id_prof:createdProf.prof.user,
              name:createdProf.prof.name,
              familyname:createdProf.prof.familyname,
              email:createdProf.prof.email            
            })
        }
    ]
    })

    console.log(createdProf)
    return createdProf
  }


//get cv and prof picture
@Get('/getDocuments/:idP')
async getDocuments(@Param('idP') idP:string){
  try{
    
    const prof=await this.authService.profById(idP)
    
   const absolutePathCV = path.resolve(String(prof.Cv));
   const absolutePathPicture = path.resolve(String(prof.picture));

    return {
    cvPath: absolutePathCV,
    picturePath: absolutePathPicture,
  };
  }catch(err){
    console.log(err)
  }
}

@Get('fileContent/:filename')
async getFileContent(@Param('filename') filename: string, @Res() res: Response) {
  try {
    // Construct the absolute file path
    const filePath = path.resolve(`/home/marwa/Desktop/backend/auth/uploads/${filename}`);
    // Send the file
    res.sendFile(filePath);
  } catch (err) {
    console.error(err);
    
  }
}


//signup Student
  @Post('signup/student')
  async signupStudent(
    @Body() createUserDto: UserDTO,
    @Body() profileDto: StudentDTO,
  ) {
    return await this.authService.signupStudent(createUserDto, profileDto);
  }
  //login user
  @Post('login')
  async login(@Body() loginDto: LoginDTO) {
    const { email, password } = loginDto;
    const token = await this.authService.login(email, password);
    return { token };
  }
// get the user by token
  @Get('user')
  async getUser(@Req() request: Request) {
    const token = request.headers.authorization;
    return this.authService.decodeToken(token);
  }
  // very role of the user
  @Get('user/:role')
  async getUserWithRole(@Req() request: Request) {
    const token = request.headers.authorization;
    const role = request.params.role;
    const decoded = this.authService.decodeToken(token);
    const verified = await this.authService.verifyUserRole(decoded.id, role);
    if (verified) {
      return decoded;
    } else {
      throw new ForbiddenException('forbidden');
    }
  }
  // verify account by sending an email
  @Post('verify')
  async verifyUser(@Req() request: Request) {
    const token = request.headers.authorization;
    return this.authService.verifyUser(token);
  }


  @Get('getInfoUser')
  async getUserInfo(@Req() request: Request) {
    const token = request.headers.authorization;
    const decoded = this.authService.decodeToken(token);
    return await this.authService.getUserInfoById(decoded.id)
  }
  

  @Post('upload')
  @UseInterceptors(FileInterceptor('picture')) 
  async uploadFile(@UploadedFile() file: Express.Multer.File) {
    try {
      if (!file) {
        throw new Error('No file uploaded');
      }
      const result = await this.authService.uploadToCloudinary(file.buffer);
      return result;
    } catch (error) {
      console.error('Error uploading image:', error);
      throw new Error('Failed to upload image');
    }
  }

  @Get('userRole')
  async getUsreRole(@Req() request: Request) {
    const token = request.headers.authorization;
    const decoded = this.authService.decodeToken(token);
    const user=await this.authService.GetUserById(decoded.id)
    return user.role
  }

  @Get('profInfo/:id')
  async getProfInfoByIdProf(id:string) {
    
    const user=await this.authService.getProfInfoByIdUser(id)
    return user
  }

  @Delete('deleteProf/:idP')
  async deleteProfBYId(@Param('idP') idP:string) {

    await this.producerService.produce({
      topic:'delete_prof',
      messages:[
        {
            value:JSON.stringify({
              id_prof:idP              
            })
        }
    ]
    })
    return await this.authService.deleteProf(idP)
  }

  @Get('/studentInfo/:idS')
  async getStudentById(@Param('idS') idS:string){
    try{
      return await this.authService.StudentInfoBYId(idS)
    }catch(err){
      console.log(err)
    }

  }

  @Get('/profNumber')
  async profNumber(){
    try{
      return await this.authService.profNumber()
    }catch(err){
      console.log(err)
    }

  }
  @Get('/stdeuntNumber')
  async studentNumber(){
    try{
      return await this.authService.studentNumber()
    }catch(err){
      console.log(err)
    }

  }
}
