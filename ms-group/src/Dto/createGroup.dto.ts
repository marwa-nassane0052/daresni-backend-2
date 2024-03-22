import { IsDate } from "class-validator"

export class CreateGroupDto{
    groupName:string

    @IsDate({each:true})
    startingDate:Date[]

    @IsDate()
    deadlineDate:Date

}