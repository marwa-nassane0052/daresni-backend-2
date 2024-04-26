import { IsString, IsEnum, IsNumber } from 'class-validator';
import { Level } from 'src/enum/level';
import { Speciality } from 'src/enum/speciality';
import { Years } from 'src/enum/years';

export class CreateGcDto{
    moduleName:string

    @IsEnum(Years)
    year:string
    //1ere 2eme
    
    @IsEnum(Speciality)
    speciality:string
    //if lycee seince math  if sum no 

        
    @IsNumber()
    studentNumber:Number
    //20
     
    @IsNumber()
    price:Number
    //2000
 
    @IsNumber()
    sessionsNumberPerWeek:Number
    //2 séance par semain

    @IsNumber()
    studyDuration:Number
    //weeks number the need to be stydy

    @IsNumber()
    sessionDuration:Number
    //specify the time 2h or 3h

}