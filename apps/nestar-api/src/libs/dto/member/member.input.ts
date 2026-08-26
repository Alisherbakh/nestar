import { Field, InputType, Int } from "@nestjs/graphql";
import { IsIn, isNotEmpty, IsNotEmpty, IsOptional, Length, Min } from 'class-validator';
import { MemberAuthType, MemberStatus, MemberType } from "../../enums/member.enum";
import { availableAgentSorts } from "../../config";
import { Direction } from "../../enums/common.enum";


// Kirib kelyotgan malumotlar uchun
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
    @Field(() => MemberType, { nullable: true}) // bolishi ham mumkun, bolmasligi ham
    memberType?: MemberType;

    @IsOptional()
    @Field(() => MemberAuthType, { nullable: true}) // bolishi ham mumkun, bolmasligi ham
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
    @IsOptional()
    @Field(() => String, { nullable: true})
    text?: string;
}


// getAgents
@InputType()
export class AgentsInquiry {
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
    @Field(() => AiSearch)
    search: AiSearch;
    
}



@InputType()
class MISearch {

     @IsOptional()
     @Field(() => MemberStatus, { nullable: true})
     memberStatus?: MemberStatus;

      @IsOptional()
     @Field(() => MemberType, { nullable: true})
     memberType?: MemberType;



    @IsOptional()
    @Field(() => String, { nullable: true})
    text?: string;
}


// getAgents
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