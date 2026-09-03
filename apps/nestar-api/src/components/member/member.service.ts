import { BadRequestException, Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, ObjectId } from 'mongoose';
import { Member, Members } from '../../libs/dto/member/member';
import { AgentsInquiry, LoginInput, MemberInput, MembersInquiry } from '../../libs/dto/member/member.input';
import { MemberStatus, MemberType } from '../../libs/enums/member.enum';
import { Direction, Message } from '../../libs/enums/common.enum';
import { AuthService } from '../auth/auth.service';
import { MemberUpdate } from '../../libs/dto/member/member.update';
import { StatisticModifier, T } from '../../libs/types/common';
import { ViewService } from '../view/view.service';
import { ViewGroup } from '../../libs/enums/view.enum';
import { LikeInput } from '../../libs/dto/like/like.input';
import { LikeGroup } from '../../libs/enums/like.enum';
import { LikeService } from '../like/like.service';

@Injectable()
export class MemberService {
    // memberSchema model integratsiyasi step-2                        // qaytaryotgan malumot Member
    constructor(@InjectModel('Member') private readonly memberModel: Model<Member>, 
    private authService: AuthService, // Step 3 auth serviceni chaqirib object hosil qilinyabdi 
    private viewService: ViewService, // Step 3 view serviceni chaqirib object hosil qilinyabdi 
    private likeService: LikeService,
) {}
                                            // qaytaryotgan malumot Member
    public async signup(input: MemberInput): Promise<Member> {
       
        input.memberPassword = await this.authService.hashPassword(input.memberPassword);
        try{ // clientga errorlar korinmasligi uchun try catch qilindi,chiroyli error korsatish uchun
            const result = await this.memberModel.create(input);
           
            // Authentication via Token
            result.accessToken = await this.authService.createToken(result);
            // kirib kelayotgan result dan accesstoken shakllantrilyabdi

            return result;
        } catch(err) {
            console.log('Error, Service.model:', err.message);
            throw new BadRequestException(Message.USED_MEMBER_NICK_OR_PHONE);
        }
        
    }

    public async login(input: LoginInput): Promise<Member> {
        const { memberNick, memberPassword } = input; // distraction input
        const response: Member | null = await this.memberModel
             .findOne({ memberNick: memberNick})
             .select('+memberPassword') // forced call from database
             .exec();

        if(!response || !response.memberPassword || response.memberStatus === MemberStatus.DELETE) {
            throw new InternalServerErrorException(Message.NO_MEMBER_NICK);
        } else if (response.memberStatus === MemberStatus.BLOCK){
            throw new InternalServerErrorException(Message.BLOCKED_USER);
        }

        // TODO Compare passwords
        const isMatch = await this.authService.comparePasswords(input.memberPassword, response.memberPassword);
        if (!isMatch) throw new InternalServerErrorException(Message.WRONG_PASSWORD);
        response.accessToken = await this.authService.createToken(response);
        
        return response;
    }

    public async updateMember(memberId: ObjectId, input: MemberUpdate): Promise<Member> {
        // @ts-ignore
        const result: Member = await this.memberModel.findOneAndUpdate(
            {
                _id: memberId, // FIlter
                memberStatus: MemberStatus.ACTIVE, 
            },
            input, // Update
            { new: true}, // Option
        ).exec();
        if(!result) throw new InternalServerErrorException(Message.UPLOAD_FAILED);
       // accessToken yangilanyabdi, sabab frontend da accessToken malumotlaridan foydalaniladi
       // yangilanmasa Frontenddagi malumotlar ozgarmaydi
        result.accessToken = await this.authService.createToken(result);  // @ts-ignore
        return result;
    }
   // memberId kim murojat qilayabdi, targetID kim ni kormoqchi
    public async getMember(memberId: ObjectId, targetId: ObjectId): Promise<Member> {
        const search: T = {
            _id: targetId, // kimni malumotini kormoqchi, osha odamni id si
            memberStatus: {
                $in: [MemberStatus.ACTIVE, MemberStatus.BLOCK],
            },
        };
        const targetMember = await this.memberModel.findOne(search).lean().exec();
        if (!targetMember) throw new InternalServerErrorException(Message.NO_DATA_FOUND); 
        
        if (memberId){
            // record view. memberId> kim tomosha ql , viewRefId> kimni tomosha ql
            const viewInput = { memberId: memberId, viewRefId: targetId, viewGroup: ViewGroup.MEMBER};
            const newView = await this.viewService.recordView(viewInput);
            if (newView) {
                 // increase memberView
                await this.memberModel    // inc = increase
                .findOneAndUpdate(search, {$inc: {memberViews: 1}}, { new: true}).exec(); //@ts-ignore
                targetMember.memberViews++;
            }
           
        }
        //@ts-ignore
        return targetMember;
    }


      public async getAgents(memberId: ObjectId, input: AgentsInquiry): Promise<Members> {
        const { text } = input.search;
        const match: T = { memberType: MemberType.AGENT, memberStatus: MemberStatus.ACTIVE};
        const sort: T = { [input?.sort ?? 'createdAt']: input?.direction ?? Direction.DESC};

        if (text) match.memberNick = { $regex: new RegExp(text, 'i')};
        console.log('match', match);

        const result = await this.memberModel.aggregate([
            { $match: match},
            { $sort: sort},
            {// facet bir nechta pipes larni ishlatishni imkonini beradi
                $facet: { //nechta agent ni skip qilsin, limit inputni ichidagi limit
                    list: [{ $skip: (input.page -1) * input.limit}, { $limit: input.limit}],
                    metaCounter: [{ $count: 'total'}], // agentlar umumiy soni
                },
            },
        ]).exec();

        if (!result.length) throw new InternalServerErrorException(Message.NO_DATA_FOUND);
        return result[0];
    }


    public async likeTargetMember(memberId: ObjectId, likeRefId: ObjectId): Promise<Member> {//@ts-ignore
        const target: Member = await this.memberModel.findOne({ _id: likeRefId, memberStatus: MemberStatus.ACTIVE }).exec();
        if (!target) throw new InternalServerErrorException(Message.NO_DATA_FOUND);

        const input: LikeInput = {
            memberId: memberId,
            likeRefId: likeRefId,
            likeGroup: LikeGroup.MEMBER,
        };

        // LIKE TOGGLE via Like modules
        const modifier: number = await this.likeService.toggleLike(input);
        const result = await this.memberStatsEditor({ _id: likeRefId, targetKey: 'memberLikes', modifier: modifier });

        if (!result) throw new InternalServerErrorException(Message.SOMETHING_WENT_WRONG);
        return result;
    }


     public async getAllMembersByAdmin(input: MembersInquiry): Promise<Members> {

        const { memberStatus, memberType, text } = input.search;
        const match: T = {}; // hamma statusdagi va turdagi members
        const sort: T = { [input?.sort ?? 'createdAt']: input?.direction ?? Direction.DESC};
        
        if (memberStatus) match.MemberStatus = memberStatus;
        if (memberType) match.memberType = memberType;
        if (text) match.memberNick = { $regex: new RegExp(text, 'i')};
        // qidirish uchun katta kichik harf
        console.log('match', match);

        const result = await this.memberModel.aggregate([
            { $match: match},
            { $sort: sort},
            {
                $facet: { // qidiruvda chiqgan members
                    list: [{ $skip: (input.page -1) * input.limit}, { $limit: input.limit}],
                    metaCounter: [{ $count: 'total'}], // ummumiy databasedagi members
                },
            },
        ]).exec();

        if (!result.length) throw new InternalServerErrorException(Message.NO_DATA_FOUND);
        return result[0];
    }



    public async updateMemberByAdmin(input: MemberUpdate): Promise<Member> { //@ts-ignore
        const result: Member = await this.memberModel.findOneAndUpdate(
            {_id: input._id},  //Filter
            input, // update
            {new: true}) // option
            .exec();
        if (!result) throw new InternalServerErrorException(Message.UPDATE_FAILED);
        return result;
    }


    public async memberStatsEditor(input: StatisticModifier): Promise<Member> {
        // data staticni yangilash uchun
        const { _id, targetKey, modifier } = input; //@ts-ignore
        return await this.memberModel
            .findByIdAndUpdate(
                _id,
                {
                    $inc: { [targetKey]: modifier },
                },
                { new: true },
            )
            .exec();
    }


}
