import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { HydratedDocument, Mongoose, Types } from "mongoose";
import { Level } from "src/enum/level";
import { Speciality } from "src/enum/speciality";
import { Years } from "src/enum/years";

export type GroupContainerDocuemnt=HydratedDocument<GroupContainer>
@Schema()
export class GroupContainer{

    @Prop()
    moduleName:string

    @Prop()
    profId:string

    @Prop({enum:Level})
    level:string

    @Prop({enum:Years})
    year:string

    @Prop({enum:Speciality})
    speciality:string

    @Prop()
    price:Number

    @Prop()
    sessionsNumberPerWeek:Number

    //this to specify how much month this goups will study by month
    @Prop()
    studyDuration:Number

    @Prop()
    studentNumber:Number
     
    //this to specify how much time groups will study for exemple 2h 3h...
    @Prop()
    sessionDuration:Number

    @Prop()
    valide:Boolean

    @Prop({type:[{type:Types.ObjectId,ref:'group'}]})
    groups:Types.ObjectId[]

}
export const GroupContainerSchema=SchemaFactory.createForClass(GroupContainer)