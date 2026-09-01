import { Field, InputType, Int } from "@nestjs/graphql";
import { IsIn, isNotEmpty, IsNotEmpty, IsOptional, Length, Min } from 'class-validator';
import { MemberAuthType, MemberStatus, MemberType } from "../../enums/member.enum";
import { availableAgentSorts } from "../../config";
import { Direction } from "../../enums/common.enum";


// Kirib kelyotgan malumotlar uchun backend ga
@InputType()
export class MemberInput {
    @IsNotEmpty()
    @Length(3,12)
    @Field(() => String)
    memberNick: string;

    @IsNotEmpty()
    @Length(5,12)
    @Field(() => String)
    memberPassword: string;

    @IsNotEmpty()
    @Field(() => String)
    memberPhone: string;

    @IsOptional()
    @Field(() => MemberType, { nullable: true}) // bolishi ham mumkun, bolmasligi ham, membertype enums dan birini oladi
    memberType?: MemberType;

    @IsOptional()
    @Field(() => MemberAuthType, { nullable: true}) // bolishi ham mumkun, bolmasligi ham, memberauthtype enums dan birini oladi
    memberAuthType?: MemberAuthType;



}



@InputType()
export class LoginInput {
    @IsNotEmpty()
    @Length(3,12)
    @Field(() => String)
    memberNick: string;

    @IsNotEmpty()
    @Length(5,12)
    @Field(() => String)
    memberPassword: string;


}

@InputType()
class AiSearch {
    @IsOptional() // searchingda agentni nomi bilan qidirish
    @Field(() => String, { nullable: true})
    text?: string;
}


// getAgents
@InputType() // agentlarni olish uchun Input type
export class AgentsInquiry {
    @IsNotEmpty() // pagination uchun
    @Min(1)
    @Field(() => Int)
    page: number; // page raqami

    @IsNotEmpty()
    @Min(1)
    @Field(() => Int)
    limit: number; // nechta card


    @IsOptional()
    @IsIn(availableAgentSorts) // aynan arraydagi qiymatlarni qabul qiladi
    @Field(() => String, { nullable: true})
    sort?: string; // sorting qaysi 

    @IsOptional()
    @Field(() => Direction, { nullable: true}) // common.ts enumdan olinyabdi
    direction?: Direction; // yuqoridan  pastga , pastdan yuqoriga
    
    @IsNotEmpty()
    @Field(() => AiSearch) // searchingda agentni nomi bilan qidirish
    search: AiSearch;
    
}



@InputType()
class MISearch {

     @IsOptional()
     @Field(() => MemberStatus, { nullable: true})
     memberStatus?: MemberStatus; // search by member status

      @IsOptional()
     @Field(() => MemberType, { nullable: true})
     memberType?: MemberType; // search by membertype



    @IsOptional()
    @Field(() => String, { nullable: true})
    text?: string; // search by text
}


// search all types members
@InputType()
export class MembersInquiry {
    @IsNotEmpty()
    @Min(1)
    @Field(() => Int)
    page: number;

    @IsNotEmpty()
    @Min(1)
    @Field(() => Int)
    limit: number;


    @IsOptional()
    @IsIn(availableAgentSorts) // arraydagi qiymatlarni qabul qiladi
    @Field(() => String, { nullable: true})
    sort?: string;

    @IsOptional()
    @Field(() => Direction, { nullable: true})
    direction?: Direction; // yuqoridan  pastga , pastdan yuqoriga
    
    @IsNotEmpty()
    @Field(() => MISearch)
    search: MISearch;
    
}