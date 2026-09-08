import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, ObjectId } from 'mongoose';
import { Like, MeLiked } from '../../libs/dto/like/like';
import { LikeInput } from '../../libs/dto/like/like.input';
import { Message } from '../../libs/enums/common.enum';
import { T } from '../../libs/types/common';
import { OrdinaryInquiry } from '../../libs/dto/property/property.input';
import { Properties } from '../../libs/dto/property/property';
import { LikeGroup } from '../../libs/enums/like.enum';
import { lookupFavorite } from '../../libs/config';

@Injectable()
export class LikeService {
	constructor(@InjectModel('Like') private readonly likeModel: Model<Like>) {}
  // 2 birmartta bosilganda like bosib, yana bossa likeni olib tashlash
	public async toggleLike(input: LikeInput): Promise<number> {
		const search: T = { memberId: input.memberId, likeRefId: input.likeRefId },
			exist = await this.likeModel.findOne(search).exec();
		let modifier = 1; // by default teng 1 ga

		if (exist) {// oldin like bosganmizmi yoki yoqmi tekshirish
			await this.likeModel.findOneAndDelete(search).exec();
			modifier = -1;// like bosgan bolsak -1
		} else {
			try {
				await this.likeModel.create(input); // bosmagan bolsak +1
			} catch (err) {
				console.log('Error, Service.model:', err.message);
				throw new BadRequestException(Message.CREATE_FAILED);
			}
		}

		console.log(`- Like modifier ${modifier} -`);
		return modifier;
	}
// getmember, get property, getarticle methodlarda like bosganmizmi yoqmi shu malumotni olish uchun
    public async checkLikeExistence(input: LikeInput): Promise<MeLiked[]> {
      const { memberId, likeRefId } = input;
      const result = await this.likeModel.findOne({ memberId: memberId, likeRefId: likeRefId }).exec();
      return result ? [{ memberId: memberId, likeRefId: likeRefId, myFavorite: true }] : [];
	  // agar result qiymati bolsa member, likerefid, myfavorite , bolmasa bosh arrat
    }

	public async getFavoriteProperties(memberId: ObjectId, input: OrdinaryInquiry): Promise<Properties> {
		const { page, limit } = input;
		const match: T = { likeGroup: LikeGroup.PROPERTY, memberId: memberId };// memberId biz

		const data: T = await this.likeModel
			.aggregate([
				{ $match: match },
				{ $sort: { updatedAt: -1 } },// eng oxirgi qoyilgan like asosida sorting
				{
					$lookup: {
						from: 'properties', // collection
						localField: 'likeRefId', // likeRefId ni qbul qilib, bu property id si
						foreignField: '_id', // shu yerdan id ga teng bolgan qiymatni  izlaymiz
						as: 'favoriteProperty', // save data as this name
					},
				},
				{ $unwind: '$favoriteProperty' },
				// qabul qilingan malumotlarni arraydan tashqariga chiqarib berishini aytayabmiz, 
				// qaysi propertyga like bosilgani har bir property
				{
					$facet: {
						list: [
							{ $skip: (page - 1) * limit }, 
							{ $limit: limit }, lookupFavorite, // in config
							{ $unwind: '$favoriteProperty.memberData' }
				//favoriteProperty ni ichidagi, aytan shu propertyni hosil qilgan agentni malumotlarini olish
						],
						metaCounter: [{ $count: 'total'}],
					},
				},
			])
			.exec();

		const result: Properties = { list: [], metaCounter: data[0].metaCounter};// metacounter hosil qilindi
		result.list = data[0].list.map((ele) => ele.favoriteProperty);
		// listni ichidagi, har bir malumotni olib iteration qilinyabdi, va bizga aynan favoriteProperty ni olib berayabdi
		
		//@ts-ignore
		return result;
	}
} 
