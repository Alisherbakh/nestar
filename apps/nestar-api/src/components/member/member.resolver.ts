import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { MemberService } from './member.service';
import { AgentsInquiry, LoginInput, MemberInput, MembersInquiry } from '../../libs/dto/member/member.input';
import { Member, Members } from '../../libs/dto/member/member';
import { UseGuards } from '@nestjs/common';
import { AuthGuard } from '../auth/guards/auth.guard';
import { AuthMember } from '../auth/decorators/authMember.decorator';
import type { ObjectId } from 'mongoose';
import { Roles } from '../auth/decorators/roles.decorator';
import { MemberType } from '../../libs/enums/member.enum';
import { RolesGuard } from '../auth/guards/roles.guard';
import { MemberUpdate } from '../../libs/dto/member/member.update';
import { getSerialForImage, shapeIntoMongoObjectId, validMimeTypes } from '../../libs/config';
import { WithoutGuard } from '../auth/guards/without.guard';
import { GraphQLUpload, FileUpload } from 'graphql-upload';
import { createWriteStream } from 'fs';
import { Message } from '../../libs/enums/common.enum';


@Resolver()
export class MemberResolver {
    constructor(private readonly memberService: MemberService) {}
    // member service ni chaqirib olyabmiz, va obyect hosil qlindi   

    // qaytaryotgan qiymat Member dto dagi maumotlar
    @Mutation(() => Member)  // @Args param decorator
    public async signup(@Args('input') input: MemberInput): Promise<Member>{
        // kirib kelayotgan malumot dto MemberInput bolishi shart bolgan malumotlar
             console.log("Mutation: signup");
             return await this.memberService.signup(input);
        }
       
    

     @Mutation(() => Member) // @Args param decorator
    public async login(@Args("input") input: LoginInput): Promise<Member>{
         
              console.log("Mutation: login");
              return await this.memberService.login(input);
        } 
    

     @UseGuards(AuthGuard)// auth bolganmi yoqmi tekshiryabmiz
     @Query(() => String) // @AuthMember param decortor, sabab update da authbolgan user info kerak
    public async checkAuth(@AuthMember("memberNick") memberNick: string): Promise<string>{
        console.log("Query: updateMember");
        console.log("memberNick:", memberNick);
        return `Hi ${memberNick}`;
    }
    // metadata sifatida role lar yuklanyabdi
    @Roles(MemberType.USER, MemberType.AGENT)
    @UseGuards(AuthGuard)
     @Query(() => String)
    public async checkAuthRoles(@AuthMember() authMember: Member): Promise<string>{
        console.log("Query: checkAuthRoles");
        return `Hi ${authMember.memberNick}, you are ${authMember.memberType} (memberId: ${authMember._id})`;
    }
    
    
  
    @UseGuards(AuthGuard) // auth bolganmi yoqmi tekshiryabmiz
     @Mutation(() => Member) // qaytarilayotgan malumot
    public async updateMember(
        @Args('input') input: MemberUpdate, 
        @AuthMember('_id') memberId: ObjectId,// @AuthMember param decortor, sabab update da authbolgan user info kerak
    ): Promise<Member>{
        console.log("Mutation: updateMember"); // @ts-ignore
        delete input._id;// input dan kirib kelgan ID kerak emas, uni Authmember ID dan olamiz
        // hacking ni oldini olish uchun
        return await this.memberService.updateMember(memberId, input);
    }


   
    @UseGuards(WithoutGuard)
    // views lar uchun auth bolgan user bolsa, malumotini olib, views +1, login bolmagan bolsa ham hatosiz otkazib yuboramiz
     @Query(() => Member)
    public async getMember(@Args('memberId') input: string, @AuthMember('_id') memberId: ObjectId): Promise<Member>{
        console.log("Query: getMember");
        const targetId = shapeIntoMongoObjectId(input);
        return this.memberService.getMember(memberId, targetId);
    }

    @UseGuards(WithoutGuard)
    @Query(() => Members)
    public async getAgents(@Args('input') input: AgentsInquiry, @AuthMember('_id') memberId: ObjectId): Promise<Members>{
        console.log('Query: getAgents');
        return await this.memberService.getAgents(memberId, input);
    }

    @UseGuards(AuthGuard)
    @Mutation(() => Member)
    public async likeTargetMember(
        @Args('memberId') input: string, // qaysi memberga like bosmoqchimiz
        @AuthMember('_id') memberId: ObjectId, // murojatchi ning ID
    ): Promise<Member> {
        console.log('Mutation: likeTargetMember');
        const likeRefId = shapeIntoMongoObjectId(input);
        return await this.memberService.likeTargetMember(memberId, likeRefId);
    }

    /* ADMIN */

    // Authorization: ADMIN
    @Roles(MemberType.ADMIN) // metadata sifatida role lar yuklanyabdi
    @UseGuards(RolesGuard)
    @Query(() => Members)
    public async getAllMembersByAdmin(@Args('input') input: MembersInquiry): Promise<Members> {
        console.log('Query: getAllMembersByAdmin');
        return await this.memberService.getAllMembersByAdmin(input);
    }

     // Authorization: ADMIN
     @Roles(MemberType.ADMIN)
    @UseGuards(RolesGuard)
    @Mutation(() => Members)
    public async updateMemberByAdmin(@Args('input') input: MemberUpdate): Promise<Members> {
        console.log("Mutation: updateMemberByAdmin"); // @ts-ignore
        return await this.memberService.updateMemberByAdmin();
    }
    

    /** UPLOADER **/

    @UseGuards(AuthGuard)
@Mutation((returns) => String)
public async imageUploader( // kirib kelayotgan fileni, file nomi bilan olib, type graphQl
	@Args({ name: 'file', type: () => GraphQLUpload })
{ createReadStream, filename, mimetype }: FileUpload, // destruction
@Args('target') target: String,// target orqali, yuklanyotgan file ni qaysi manzilga saqlashi aytilyabdi
): Promise<string> {
	console.log('Mutation: imageUploader');

	if (!filename) throw new Error(Message.UPLOAD_FAILED);
const validMime = validMimeTypes.includes(mimetype);// file type tekshirilyabdi, config.ts
if (!validMime) throw new Error(Message.PROVIDE_ALLOWED_FORMAT);

const imageName = getSerialForImage(filename); // random image name
const url = `uploads/${target}/${imageName}`;// uploads folderni target manziliga save
const stream = createReadStream();
// stream orqali ochiladi

const result = await new Promise((resolve, reject) => {
	stream// pipe ga hosil qilinggan url beriladi
		.pipe(createWriteStream(url))
		.on('finish', async () => resolve(true))// success => resolve
		.on('error', () => reject(false)); // error => reject
});
if (!result) throw new Error(Message.UPLOAD_FAILED);

return url;
}

@UseGuards(AuthGuard)
@Mutation((returns) => [String])
public async imagesUploader(
	@Args('files', { type: () => [GraphQLUpload] })
files: Promise<FileUpload>[],
@Args('target') target: String,
): Promise<string[]> {
	console.log('Mutation: imagesUploader');

	const uploadedImages = [];
	const promisedList = files.map(async (img: Promise<FileUpload>, index: number): Promise<Promise<void>> => {
		try {
			const { filename, mimetype, encoding, createReadStream } = await img;

			const validMime = validMimeTypes.includes(mimetype);
			if (!validMime) throw new Error(Message.PROVIDE_ALLOWED_FORMAT);

			const imageName = getSerialForImage(filename);
			const url = `uploads/${target}/${imageName}`;
			const stream = createReadStream();

			const result = await new Promise((resolve, reject) => {
				stream
					.pipe(createWriteStream(url))
					.on('finish', () => resolve(true))
					.on('error', () => reject(false));
			});
			if (!result) throw new Error(Message.UPLOAD_FAILED); //@ts-ignore

			uploadedImages[index] = url;
		} catch (err) {
			console.log('Error, file missing!');
		}
	});

	await Promise.all(promisedList);
	return uploadedImages;
}





}
