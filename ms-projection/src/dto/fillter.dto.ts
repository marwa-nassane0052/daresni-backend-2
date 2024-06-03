import { IsString, IsNumber } from 'class-validator';


export class fillterDto{
    @IsString()
    moduleName:string
 
    @IsString()
    level:String

    @IsString()
    year:string
    //1ere 2eme
    
   @IsString()
   speciality:string
    //if lycee seince math  if sum no 
     
    @IsNumber()
    price:Number

}