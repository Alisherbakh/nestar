import { ObjectId } from 'bson';
// agent larni sort qilish uchun
export const availableAgentSorts = ['createdAt', 'updatedAt', 'memberLikes', 'memberViews', 'memberRank'];

export const availableMemberSorts = ['createdAt', 'updatedAt', 'memberLikes', 'memberViews'];

export const availableOptions = ['propertyBarter', 'propertyRent'];
export const availablePropertySorts = [
	'createdAt',
	'updatedAt',
	'propertyLikes',
	'propertyViews',
	'propertyRank',
	'propertyPrice',
];

export const availableBoardArticleSorts = ['createdAt', 'updatedAt', 'articleLikes', 'articleViews'];
export const availableCommentSorts = ['createdAt', 'updatedAt'];
 /**  IMAGE CONFIGURATION (config.js) **/
import { v4 as uuidv4 } from 'uuid';
import * as path from 'path';

// yuklanyotgan file type shular bolsin
export const validMimeTypes = ['image/png', 'image/jpg', 'image/jpeg'];
export const getSerialForImage = (filename: string) => { // random  image name
	const ext = path.parse(filename).ext;
	return uuidv4() + ext;
};



export const shapeIntoMongoObjectId = (target: any) => {
    return typeof target === "string" ? new ObjectId(target) : target
	// kirib kelayotgan string id ni objectID ga ozgatirilyabdi
};






export const lookupMember = {
	$lookup: {
		from: 'members',// members kolleksiyasi bilan birlashtirish (JOIN).
		localField: 'memberId',//joriy kolleksiyadagi (masalan: ko'chmas mulk yoki izoh hujjatidagi) memberId maydonini olish.
		foreignField: '_id',//uni members kolleksiyasidagi hujjatlarning _id maydoni bilan mos keltirish.
		as: 'memberData',//topilgan a'zo ma'lumotlarini memberData deb nomlangan yangi massiv (array) maydoniga joylashtirish.
	},
};

export const lookupFollowingData = {
	$lookup: {
		from: 'members',
		localField: 'followingId',
		foreignField: '_id',
		as: 'followingData',
	},
};

export const lookupFollowerData = {
	$lookup: {
		from: 'members',
		localField: 'followerId',
		foreignField: '_id',
		as: 'followerData',
	},
};

export const lookupAuthMemberLiked = <T>(memberId: T, targetRefId: string = '$_id') => {
	return {
		$lookup: {
			from: 'likes',
			let: {
				localLikeRefId: targetRefId,
				localMemberId: memberId,
				localMyFavorite: true,
			},
			pipeline: [
				{
					$match: {
						$expr: {
							$and: [{ $eq: ['$likeRefId', '$$localLikeRefId'] }, { $eq: ['$memberId', '$$localMemberId'] }],
						},
					},
				},
				{
					$project: {
						_id: 0,
						memberId: 1,
						likeRefId: 1,
						myFavorite: '$$localMyFavorite',
					},
				},
			],
			as: 'meLiked',
		},
	};
};

