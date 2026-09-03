import { Field, ObjectType } from '@nestjs/graphql';
import { LikeGroup } from '../../enums/like.enum';
import { ObjectId } from 'mongoose';

@ObjectType()
export class MeLiked {
	@Field(() => String)//@ts-ignore
	memberId: ObjectId;

	@Field(() => String)//@ts-ignore
	likeRefId: ObjectId;

	@Field(() => Boolean)
	myFavorite: boolean;
}

@ObjectType()
export class Like {
	@Field(() => String)//@ts-ignore
	_id: ObjectId;

	@Field(() => LikeGroup)
	likeGroup: LikeGroup;

	@Field(() => String)//@ts-ignore
	likeRefId: ObjectId;

	@Field(() => String)//@ts-ignore
	memberId: ObjectId;

	@Field(() => Date)
	createdAt: Date;

	@Field(() => Date)
	updatedAt: Date;
}


