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
  imports: [
    ConfigModule.forRoot(), // .env configuratsiyasi
    GraphQLModule.forRoot({ // graphql api integratsiyasi
      driver: ApolloDriver,
      playground: true,
      uploads: false,
      autoSchemaFile: true,
      formatError: (error: T) => { // Global Error Handiling
        const graphQLFormattedError = {
          code: error?.extensions.code  ,
          message: 
            error?.extensions?.exception?.response?.message || error?.extensions?.response?.message || error?.message,
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
export class AppModule {}
