import { Field, Int, ObjectType } from "@nestjs/graphql";
import { ObjectId } from "mongoose";
import { MemberAuthType, MemberStatus, MemberType } from "../../enums/member.enum";

@ObjectType()
export class Member{
    @Field(() => String)
    _id: ObjectId | undefined;

    @Field(() => MemberType)
    memberType: MemberType | undefined;

    @Field(() => MemberStatus)
    memberStatus: MemberStatus | undefined;

    @Field(() => String)
    memberAuthType: MemberAuthType | undefined;

    @Field(() => String)
    memberPhone: string | undefined;

    @Field(() => String)
    memberNick: string | undefined;

    memberPassword?: string;

    @Field(() => String, {nullable: true})
    memberFullName?: string;

    @Field(() => String)
    memberImage: string | undefined;

    @Field(() => String, {nullable: true})
    memberAddress?: string;

    @Field(() => String, {nullable: true})
    memberDesc?: string;

    @Field(() => Int)
    memberProperties: number | undefined;

     @Field(() => Int)
    memberArticles: number | undefined;

     @Field(() => Int)
    memberFollowers: number | undefined;

     @Field(() => Int)
    memberFollowings: number | undefined;

     @Field(() => Int)
    memberPoints: number | undefined;

     @Field(() => Int)
    memberLikes: number | undefined;

     @Field(() => Int)
    memberViews: number | undefined;

     @Field(() => Int)
    memberComments: number | undefined;

     @Field(() => Int)
    memberRank: number | undefined;

     @Field(() => Int)
    memberWarnings: number | undefined;

     @Field(() => Int)
    memberBlocks: number | undefined;

    @Field(() => Date, {nullable: true})
    deletedAt?: Date;

    @Field(() => Date)
    createdAt: Date | undefined;

    @Field(() => Date)
    updatedAt: Date | undefined;
}