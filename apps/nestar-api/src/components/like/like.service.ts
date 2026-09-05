import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Like, MeLiked } from '../../libs/dto/like/like';
import { LikeInput } from '../../libs/dto/like/like.input';
import { Message } from '../../libs/enums/common.enum';
import { T } from '../../libs/types/common';

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
}
