import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';

export type NotificationDocument = HydratedDocument<Notification>;

@Schema()
export class Notification {

    @Prop()
    name: string;

    @Prop()
    familyname: string;


    @Prop()
    email: string;
    
    
    @Prop()
    userType: string;

    @Prop()
    notificationContent:string
    

    @Prop({ type: Date, default: Date.now })
    created_at: Date;
}

export const NotificationSchema = SchemaFactory.createForClass(Notification);
