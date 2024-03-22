import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { HydratedDocument, Types } from 'mongoose';


export type GroupDocuemnt=HydratedDocument<Group>
@Schema()
export class Group{
    @Prop()
    groupName:string

    @Prop([{type:Date}])
    startingDates:Date[]

    @Prop()
    planing:[{
        sessionNumber:string,
        dates:Date[]
    }]

    @Prop()
    deadlineDate:Date

    @Prop({type:Types.ObjectId,ref:'groupContainer'})
    groupContainer:Types.ObjectId

    @Prop()
    document:string[]

    @Prop()
    record:string[]

    @Prop()
    studentList:string[]
}
export const GroupSchema=SchemaFactory.createForClass(Group)