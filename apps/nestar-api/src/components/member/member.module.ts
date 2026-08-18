import { Module } from '@nestjs/common';
import { MemberResolver } from './member.resolver';
import { MemberService } from './member.service';
import { MongooseModule } from '@nestjs/mongoose';
import MemberSchema from '../../schemas/Member.model';

@Module({
  // memberSchema model integratsiyasi step-1
  imports: [MongooseModule.forFeature([{ name: 'Member', schema: MemberSchema }])],
  providers: [MemberResolver, MemberService]
})
export class MemberModule {}
