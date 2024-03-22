import { IsString, IsEnum, IsNumber } from 'class-validator';
import { Level } from 'src/enum/level';
import { Speciality } from 'src/enum/speciality';
import { Years } from 'src/enum/years';

export class CreateGcDto{
    moduleName:string

    @IsEnum(Years)
    year:string
    
    @IsEnum(Speciality)
    speciality:string

        
    @IsNumber()
    studentNumber:Number
     
    @IsNumber()
    price:Number
 
    @IsNumber()
    sessionsNumberPerWeek:Number

    @IsNumber()
    studyDuration:Number

    @IsNumber()
    sessionDuration:Number

}