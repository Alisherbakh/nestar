import { Field, InputType } from "@nestjs/graphql";
import { IsNotEmpty } from 'class-validator';
import { ViewGroup } from "../../enums/view.enum";
import { ObjectId } from "mongoose";


// Kirib kelyotgan malumotlar uchun
@InputType()
export class ViewInput {
    @IsNotEmpty() // murojatchi
    @Field(() => String) //@ts-ignore
    memberId: ObjectId;

    @IsNotEmpty() // kimni kormoqchi
    @Field(() => String)//@ts-ignore
    viewRefId: ObjectId;

    @IsNotEmpty()
    @Field(() => ViewGroup) // enums lardan oladi, member, article, property
    viewGroup: ViewGroup;

}