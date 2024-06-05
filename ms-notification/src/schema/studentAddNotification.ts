import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';

export type StudentDocument = HydratedDocument<Student>;

@Schema()
export class Student {
    @Prop()
    id_student:Types.ObjectId
    
    @Prop()
    group_id:string

    @Prop()
    session_id:string

    @Prop()
    name:string

    @Prop()
    famillyName:string
}

export const StudentSchema = SchemaFactory.createForClass(Student);