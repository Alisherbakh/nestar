import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { HttpModule } from '@nestjs/axios';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [ // JWT ni chaqirilyabdi token hosil qilish uchun
    HttpModule,
    JwtModule.register({ // Option olib kelinyabdi
        secret: `${process.env.SECRET_TOKEN}`, // secret token olib kelinyabdi .env dan
        signOptions: { expiresIn: '30d'}, // token ni yashash muddati 30 kun
    })
  ],
  providers: [AuthService],
  exports: [AuthService], // Step 1, auth serviceni tashqarida ishlatish uchun
})
export class AuthModule {}
