import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { HydratedDocument, Types } from 'mongoose';


export type ProfDocuemnt=HydratedDocument<Prof>
@Schema()
export class Prof{
    @Prop()
    id_prof:Types.ObjectId
    @Prop()
    name:string

    @Prop()
    familyname:string

    @Prop()
    email:string
  
    @Prop()
    phone:number

    @Prop()
    //sessions created by this prof
    groupContainers:string[]

   
}
export const ProfSchema=SchemaFactory.createForClass(Prof)