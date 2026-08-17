import { Injectable } from '@nestjs/common';

@Injectable()
export class MemberService {
   
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
