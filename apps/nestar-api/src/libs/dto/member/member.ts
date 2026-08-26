import { Field, Int, ObjectType } from "@nestjs/graphql";
import type { ObjectId } from "mongoose";
import { MemberAuthType, MemberStatus, MemberType } from "../../enums/member.enum";

@ObjectType()
export class Member{
    @Field(() => String)
    _id: ObjectId;

    @Field(() => MemberType) // graphQl ucchun type
    memberType: MemberType;

    @Field(() => MemberStatus)
    memberStatus: MemberStatus;

    @Field(() => String)
    memberAuthType: MemberAuthType;

    @Field(() => String)
    memberPhone: string;

    @Field(() => String)
    memberNick: string;

    memberPassword?: string;

    @Field(() => String, {nullable: true}) // bolishi ham mumkun, bolmasligi ham
    memberFullName?: string;

    @Field(() => String)
    memberImage: string;

    @Field(() => String, {nullable: true}) // bolishi ham mumkun, bolmasligi ham
    memberAddress?: string;

    @Field(() => String, {nullable: true}) // bolishi ham mumkun, bolmasligi ham
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

    @Field(() => String, { nullable: true})
    accessToken?: string;

   
}


@ObjectType()
export class TotalCounter {
    @Field(() => Int, {nullable: true})
    total: number;
}

 @ObjectType()
    export class Members {
        @Field(() => [Member])
        list: Member[];

        @Field(() => [TotalCounter], { nullable: true})
        metaCounter: TotalCounter[];
    }