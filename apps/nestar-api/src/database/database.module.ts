import { Module } from '@nestjs/common';
import { InjectConnection, MongooseModule } from "@nestjs/mongoose";
import { Connection } from 'mongoose'; // type interface


// dev port yoki production port daligini bilish uchun
@Module({
    imports: [
        MongooseModule.forRootAsync({
            useFactory: () => ({
                uri: process.env.NODE_ENV === 'production' ? process.env.MONGO_PROD : process.env.MONGO_DEV,
                //  Node.env da production bolsa MONGO_PROD lonk ini , aks holda MONGO_DEV link ni yurgiz
            }),
        }),
    ],
    exports: [MongooseModule], // export qilinyabdi
})

// faqat console da chiqishi uchun 
export class DatabaseModule {
    constructor(@InjectConnection() private readonly connection: Connection){
        if (connection.readyState === 1) { // loyiha muoffaqiyatli amalga oshsa 1 ga teng boladi
           console.log(
              `MongoDB is connected into ${process.env.NODE_ENV === 'production' ? 'production' : 'development'} db`,
            );
        } else {
            console.log('DB is not connected!');
        }
    }
}
