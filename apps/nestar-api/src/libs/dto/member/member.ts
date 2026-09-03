import { Field, Int, ObjectType } from "@nestjs/graphql";
import type { ObjectId } from "mongoose";
import { MemberAuthType, MemberStatus, MemberType } from "../../enums/member.enum";
import { MeLiked } from "../like/like";
import { MeFollowed } from "../follow/follow";




// backend dan frontend ga yuboriladigan dto
@ObjectType() //@ts-ignore  // objecttype dto qurish uchun ichlatiladigan decorator
export class Member{
    @Field(() => String)
    _id: ObjectId;

    @Field(() => MemberType) // graphQl uchun yozildi
    memberType: MemberType;  // typescriptga yozyabmiz 

    @Field(() => MemberStatus)
    memberStatus: MemberStatus;

    @Field(() => String)
    memberAuthType: MemberAuthType;

    @Field(() => String)
    memberPhone: string;

    @Field(() => String)
    memberNick: string;
   // graphQL paswordni clientga jonatmasligi kerak, shuning typescriptga yozyabmiz holos
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
    memberProperties: number;

     @Field(() => Int)
    memberArticles: number;

     @Field(() => Int)
    memberFollowers: number;

     @Field(() => Int)
    memberFollowings: number;

     @Field(() => Int)
    memberPoints: number ;

     @Field(() => Int)
    memberLikes: number ;

     @Field(() => Int)
    memberViews: number ;

     @Field(() => Int)
    memberComments: number ;

     @Field(() => Int)
    memberRank: number ;

     @Field(() => Int)
    memberWarnings: number ;

     @Field(() => Int)
    memberBlocks: number ;

    @Field(() => Date, {nullable: true})
    deletedAt?: Date;

    @Field(() => Date)
    createdAt: Date ;

    @Field(() => Date)
    updatedAt: Date ;

    @Field(() => String, { nullable: true})
    accessToken?: string;
    // accessToken uchun, graphQL ga yuborilyabdi, signup va login uchun
   
    /** from aggregation **/
    @Field(() => [MeLiked], { nullable: true})
    meLiked?: MeLiked[];

    @Field(() => [MeFollowed], { nullable: true})
    meFollowed?: MeFollowed[];
}


@ObjectType()  // agentlar royxati uchun
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