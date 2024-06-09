import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';

export type profDocument = HydratedDocument<Prof>;

@Schema()
export class Prof {
    @Prop()
    id_prof:Types.ObjectId
    
    @Prop()
    name:string

    @Prop()
    familyname:string

    @Prop()
    email:string



}

export const profSchema = SchemaFactory.createForClass(Prof);