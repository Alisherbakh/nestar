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

export const lookupFavorite = {
	$lookup: {
		from: 'members',
		localField: 'favoriteProperty.memberId',
		foreignField: '_id',
		as: 'favoriteProperty.memberData',
	},
};

export const lookupVisit = {
	$lookup: {
		from: 'members',
		localField: 'visitedProperty.memberId',
		foreignField: '_id',
		as: 'visitedProperty.memberData',
	},
};



export const lookupAuthMemberLiked = <T>(
	memberId: T, // murojatchini id si
    targetRefId: string = '$_id' 
	// targeted property id, $_id bu skip va limitda hosil bolgan property id sini qabul qilish uchun schema modeldan hosil bolgan, default qoyilyabdi
) => {
	return {
		$lookup: {
			from: 'likes', // qaysi collectiondan 
			let: { // search uchun complex lookup query
				localLikeRefId: targetRefId, // manosi $_id bu yerda
				localMemberId: memberId, // murojartchi
				localMyFavorite: true, // like bosganmi yoqmi 
			},
			pipeline: [
				{
					$match: {
						$expr: { // expression
							$and: [ // solishtirish mantigi, $eq: teng degani
								{ $eq: ['$likeRefId', '$$localLikeRefId'] },// local variable ishlatish uchun $$
								 { $eq: ['$memberId', '$$localMemberId'] }],
						},
					},
				},
				{ // pipline da hosil bolgan mantiqni projection qilamiz
					$project: {
						_id: 0, // id ni olib bermasin, id default 1 ga teng, like id si
						memberId: 1, // datasate default 0, 1 bolsa bolsin bu member id
						likeRefId: 1, // datasate default 0, 1 bolsa bolsin bu property id
						myFavorite: '$$localMyFavorite', // like bosgan bolsa true, bolmasam false
					},
				},
			],
			as: 'meLiked', // shu nom bilan saqlayabmiz malumotni
		},
	};
};

interface LookupAuthMemberFollowed<T> {
	followerId: T;
	followingId: string;//chunki 2 qismi string korinishida namoyon boladi
}

export const lookupAuthMemberFollowed = <T>(input: LookupAuthMemberFollowed<T>) => {
	const { followerId, followingId } = input;
	return {
		$lookup: {
			from: 'follows',
			let: { // complex lookup query search uchun
				localFollowerId: followerId,
				localFollowingId: followingId, // string
				localMyFavorite: true,
			},
			pipeline: [
				{
					$match: {
						$expr: {
							$and: [{ $eq: ['$followerId', '$$localFollowerId'] }, { $eq: ['$followingId', '$$localFollowingId'] }],
						},
					},
				},
				{
					$project: {
						_id: 0,// like id si
						followerId: 1,
						followingId: 1,
						myFollowing: '$$localMyFavorite',
					},
				},
			],
			as: 'meFollowed',
		},
	};
};

