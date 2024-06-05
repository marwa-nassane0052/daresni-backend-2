import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';

export type groupCreatesNotificationDocument = HydratedDocument<GroupCreatedNotification>;

@Schema()
export class GroupCreatedNotification {
   

    @Prop()
    groupId:Types.ObjectId
     
    @Prop()
    groupName:string

    @Prop()
    startingDate:Date

    @Prop()
    id_session:string

}

export const groupNotificationSchema = SchemaFactory.createForClass(GroupCreatedNotification);