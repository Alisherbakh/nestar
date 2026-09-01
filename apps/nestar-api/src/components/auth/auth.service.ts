import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import *  as bcrypt from 'bcryptjs';
import { T } from '../../libs/types/common';
import { Member } from '../../libs/dto/member/member';
import { shapeIntoMongoObjectId } from '../../libs/config';

@Injectable()
export class AuthService {
    constructor(private jwtService: JwtService) {}
// authModel da jwtModule ni integratsiya qilganimiz uchun, JWT service ni chaqirib ishlata olamiz

    // kirib kelayotgan passwordni hash qilinyabdi
    public async hashPassword(memberPassword: string): Promise<string> {
        const salt = await bcrypt.genSalt();
        return await bcrypt.hash(memberPassword, salt);
    }
     // kirib kelayotgan va database dagi passwordni taqqoslab togri notogriligini tekshirilyabdi
    public async comparePasswords(password: string, hashedPassword: string): Promise<boolean>{
        return await bcrypt.compare(password, hashedPassword);
    }

    public async createToken(member: Member): Promise<string> {
        // Token hosil qilinyabdi
        const payload: T = {}; // payload dan foydalanib jwt hosil qilinyabdi
 //Payload= JWT token ichiga joylashtiriladigan va shifrlanmagan holda saqlanadigan ma'lumotlar to‘plami
        Object.keys(member['_doc'] ? member['_doc'] : member).map((ele) => {
            payload[`${ele}`] = member[`${ele}`];
            // memberdan kelayotgan malumotlar asosida token hosil qilinyabdi
        });
        delete payload.memberPassword; //Parol (hatto hash qilingan bo‘lsa ham) JWT token ichida yurishi
        //mijozga (frontend'ga) yetib borishi juda xavfli 
        console.log('payload:', payload);

        return await this.jwtService.signAsync(payload);
    }
   // token ni ichida kelayotgan malumotlarni chiqarib kim murojat qilyotganini beradi
    public async verifyToken(token: string): Promise<Member> {
        const member = await this.jwtService.verifyAsync(token);
        member._id = shapeIntoMongoObjectId(member._id); 
        // memberni ichidagi ID ni object ID ga ozgartirilyabdi
        return member;
    }
}
