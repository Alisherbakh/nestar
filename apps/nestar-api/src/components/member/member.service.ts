import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

@Injectable()
export class MemberService {
    constructor(@InjectModel('Member') private readonly memberModel: Model<null>) {}
   
    public async signup(): Promise<string> {
        return 'signup exacuted!';
    }

    public async login(): Promise<string> {
        return 'login exacuted!';
    }

    public async updateMember(): Promise<string> {
        return 'updateMember exacuted!';
    }

    public async getMember(): Promise<string> {
        return 'getMember exacuted!';
    }


}
