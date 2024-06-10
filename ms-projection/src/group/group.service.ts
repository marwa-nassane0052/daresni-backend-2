import { Injectable, OnModuleInit } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ConsumerService } from 'src/kafka/consumer/consumer.service';
import { GroupContainer } from 'src/schema/groupcontainer.schema';

@Injectable()
export class GroupService implements OnModuleInit {
    constructor(private readonly consumerService: ConsumerService,
      @InjectModel(GroupContainer.name) private groupContainerModel:Model<GroupContainer>,
      ) {}
    async onModuleInit() {
        await this.consumerService.consume('group-consumer-2',
          { topics: ['group_created_event'] },
          {
            eachMessage: async ({ topic, partition, message }) => {
              const messageString = message.value.toString();
              const eventData = JSON.parse(messageString);
              const groupContainer=await this.groupContainerModel.findOne({croupContainerId:eventData.createdGroup.groupContainer})
              groupContainer.groups.push({
                groupName:eventData.createdGroup.groupName,
                startingDates:eventData.createdGroup.startingDates,
                deadlineDate:eventData.createdGroup.deadlineDate
              })
              await groupContainer.save()
              },
          },
        );
      }
}
