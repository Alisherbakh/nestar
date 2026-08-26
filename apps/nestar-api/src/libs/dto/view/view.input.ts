import { Field, InputType } from "@nestjs/graphql";
import { IsNotEmpty } from 'class-validator';
import { ViewGroup } from "../../enums/view.enum";
import { ObjectId } from "mongoose";


// Kirib kelyotgan malumotlar uchun
@InputType()
export class ViewInput {
    @IsNotEmpty()
    @Field(() => String) //@ts-ignore
    memberId: ObjectId;

    @IsNotEmpty()
    @Field(() => String)//@ts-ignore
    viewRefId: ObjectId;

    @IsNotEmpty()
    @Field(() => ViewGroup)
    viewGroup: ViewGroup;

}