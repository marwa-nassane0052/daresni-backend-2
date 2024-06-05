import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';

export type sessionCreatesNotificationDocument = HydratedDocument<SessionCreatedNotification>;

@Schema()
export class SessionCreatedNotification {
    @Prop()
    croupContainerId:Types.ObjectId
     
    @Prop()
    name:string

    @Prop()
    familyname:string

    @Prop()
    moduleName:string

    @Prop()
    level:string

    @Prop()
    year:string

    @Prop()
    speciality:string

    @Prop()
    id_prof:string


}

export const sessionNotificationSchema = SchemaFactory.createForClass(SessionCreatedNotification);