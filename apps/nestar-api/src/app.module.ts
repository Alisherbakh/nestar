import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver } from '@nestjs/apollo';
import { AppResolver } from './app.resolver';
import { ComponentsModule } from './components/components.module';
import { DatabaseModule } from './database/database.module';
import { T } from './libs/types/common';

@Module({
  imports: [ // tashqaridan kerak narsalar olib kelinadi
    ConfigModule.forRoot(), // .env configuratsiyasi, natijada main.ts da calling port
    GraphQLModule.forRoot({ // graphql api integratsiyasi
      driver: ApolloDriver, //"GraphQL so'rovlarini Apollo Server orqali qayta ishla" deyapsiz
      playground: true, // brawserda playground ni yurgizib beradi, 
      uploads: false,
      autoSchemaFile: true, // schema.gql file ni hosil qilib beradi avto
      formatError: (error: T) => { // Global Error Handiling integratsiya, formatError shows all types graphql errors
        const graphQLFormattedError = { //umumiy hatolik yaratadigan tizim
          code: error?.extensions.code  ,
          message: 
            error?.extensions?.exception?.response?.message || error?.extensions?.response?.message || error?.message,
            // qanday error bolishidan qattiy nazar shu orqali message ni qabul qilamiz
        };
        console.log('GRAPHQL GLOBAL ERR:', graphQLFormattedError);
        return graphQLFormattedError;
      }
    }),
    ComponentsModule, // component model calling Http
    DatabaseModule,   // database calling.       TCP
  ],
  controllers: [AppController],    // Health check mantiq lari yoziladi( hatosiz ishlayabdimi yoqmi project)
  providers: [AppService, AppResolver], // Rest Api
})
export class AppModule {} // loyiha markaziy bog'ichi
