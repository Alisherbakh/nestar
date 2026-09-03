import { Module } from '@nestjs/common';
import { MemberResolver } from './member.resolver';
import { MemberService } from './member.service';
import { MongooseModule } from '@nestjs/mongoose';
import MemberSchema from '../../schemas/Member.model';
import { AuthModule } from '../auth/auth.module';
import { ViewModule } from '../view/view.module';
import { LikeModule } from '../like/like.module';

@Module({
  // memberSchema model integratsiyasi step-1 hosil qilinyabdi schema
  imports: [MongooseModule.forFeature([{ name: 'Member', schema: MemberSchema }]), 
  AuthModule, // Step 2 auth serviceni memberda ishlatish uchun import qilindi
  ViewModule, // Step 2 view service ni memberda ishlatish uchun import qilindi
  LikeModule,
],
  providers: [MemberResolver, MemberService],
  exports: [MemberService],
})
export class MemberModule {}
