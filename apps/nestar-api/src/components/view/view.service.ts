import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, ObjectId } from 'mongoose';
import { View } from '../../libs/dto/view/view';
import { ViewInput } from '../../libs/dto/view/view.input';
import { T } from '../../libs/types/common';
import { OrdinaryInquiry } from '../../libs/dto/property/property.input';
import { Properties } from '../../libs/dto/property/property';
import { ViewGroup } from '../../libs/enums/view.enum';
import { lookupVisit } from '../../libs/config';

@Injectable()
export class ViewService { // view schema model inject qilinyabdi
    constructor(@InjectModel('View') private readonly viewModel: Model<View> ) {}

public async recordView(input: ViewInput): Promise<View | null>{
    const viewExist = await this.checkViewExistence(input);
    if (!viewExist){
        console.log('- New View Insert -');
        return await this.viewModel.create(input);
    }else  return null;
   
}

// view bolsa view di qaytaradi, bolmasa falsy qaytaradi
// qiymat bolmasa view +1 , bolsa qoymaymiz
private async checkViewExistence(input: ViewInput): Promise<View>{
    const { memberId, viewRefId} = input;
    const search: T = { memberId: memberId, viewRefId: viewRefId}; //@ts-ignore
    return await this.viewModel.findOne(search).exec();

}

public async getVisitedProperties(memberId: ObjectId, input: OrdinaryInquiry): Promise<Properties> {
    const { page, limit } = input;
    const match: T = { viewGroup: ViewGroup.PROPERTY, memberId: memberId };

    const data: T = await this.viewModel
      .aggregate([
        { $match: match },
        { $sort: { updatedAt: -1 } },
        {
          $lookup: {
            from: 'properties', // collectiondan
            localField: 'viewRefId', // refID ni
            foreignField: '_id', // shu id ga teng holatini izlaydi
            as: 'visitedProperty', // shu nom bilan saqlaydi
          },
        },
        { $unwind: '$visitedProperty' },
        {
          $facet: {
            list: [
              { $skip: (page - 1) * limit },
              { $limit: limit },
              lookupVisit,
              { $unwind: '$visitedProperty.memberData' },
    //visitedProperty ni ichidagi, aytan shu propertyni hosil qilgan agentni malumotlarini olish
            ],
            metaCounter: [{ $count: 'total' }],
          },
        },
      ])
      .exec();

    const result: Properties = { list: [], metaCounter: data[0].metaCounter };// metacounter hosil qilinyabdi
    result.list = data[0].list.map((ele) => ele.visitedProperty);
    // listni ichidagi, har bir malumotni olib iteration qilinyabdi, va bizga aynan favoriteProperty ni olib berayabdi

    return result;
}

}
