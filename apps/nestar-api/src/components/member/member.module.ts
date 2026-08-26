import { Module } from '@nestjs/common';
import { MemberResolver } from './member.resolver';
import { MemberService } from './member.service';
import { MongooseModule } from '@nestjs/mongoose';
import MemberSchema from '../../schemas/Member.model';
import { AuthModule } from '../auth/auth.module';
import { ViewModule } from '../view/view.module';

@Module({
  // memberSchema model integratsiyasi step-1 hosil qilinyabdi schema
  imports: [MongooseModule.forFeature([{ name: 'Member', schema: MemberSchema }]), 
  AuthModule,
  ViewModule
],
  providers: [MemberResolver, MemberService]
})
export class MemberModule {}
