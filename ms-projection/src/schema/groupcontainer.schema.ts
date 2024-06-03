import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { HydratedDocument, Mongoose, Types } from "mongoose";


export type GroupContainerDocuemnt=HydratedDocument<GroupContainer>
@Schema()
export class GroupContainer{
    @Prop()
    croupContainerId:Types.ObjectId

    @Prop()
    moduleName:string

    @Prop()
    level:string

    @Prop()
    year:string

    @Prop()
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
    valide:boolean
    @Prop()
    groups:[{
        groupName:string,
        startingDates:Date[],
        deadlineDate:Date
    }]
}
export const GroupContainerSchema=SchemaFactory.createForClass(GroupContainer)