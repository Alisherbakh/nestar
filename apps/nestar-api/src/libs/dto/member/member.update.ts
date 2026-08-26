import { Field, InputType } from "@nestjs/graphql";
import { IsNotEmpty, IsOptional, Length } from 'class-validator';
import { MemberStatus, MemberType } from "../../enums/member.enum";
import { ObjectId } from "mongoose";


// Kirib kelyotgan malumotlar uchun
@InputType()
export class MemberUpdate {
     @IsNotEmpty()
    @Field(() => String) // @ts-ignore
     _id: ObjectId;
     
     @IsOptional()
    @Field(() => MemberType, { nullable: true}) // bolishi ham mumkun, bolmasligi ham
    memberType?: MemberType;

     @IsOptional()
    @Field(() => MemberStatus, { nullable: true}) // bolishi ham mumkun, bolmasligi ham
    memberStatus?: MemberStatus;

    @IsOptional()
    @Field(() => String, { nullable: true}) // bolishi ham mumkun, bolmasligi ham
    memberPhone?: string;
    
    @IsOptional()
    @Length(3, 12)
    @Field(() => String, { nullable: true}) // bolishi ham mumkun, bolmasligi ham
    memberNick?: string;


     @IsOptional()
    @Length(5, 12)
    @Field(() => String, { nullable: true}) // bolishi ham mumkun, bolmasligi ham
    memberPassword?: string;

     @IsOptional()
    @Length(3, 100)
    @Field(() => String, { nullable: true}) // bolishi ham mumkun, bolmasligi ham
    memberFullName?: string;

     @IsOptional()
    @Field(() => String, { nullable: true}) // bolishi ham mumkun, bolmasligi ham
    memberImage?: string;


     @IsOptional()
    @Field(() => String, { nullable: true}) // bolishi ham mumkun, bolmasligi ham
    memberAddress?: string;

     @IsOptional()
    @Field(() => String, { nullable: true}) // bolishi ham mumkun, bolmasligi ham
    memberDesc?: string;

    deleteAt?: Date;

}