import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver } from '@nestjs/apollo';
import { AppResolver } from './app.resolver';
import { ComponentsModule } from './components/components.module';
import { DatabaseModule } from './database/database.module';

@Module({
  imports: [
    ConfigModule.forRoot(), // .env configuratsiyasi
    GraphQLModule.forRoot({ // graphql api integratsiyasi
      driver: ApolloDriver,
      playground: true,
      uploads: false,
      autoSchemaFile: true,
    }),
    ComponentsModule, // component model calling Http
    DatabaseModule,   // database calling.       TCP
  ],
  controllers: [AppController],    // Health check mantiq lari yoziladi( hatosiz ishlayabdimi yoqmi project)
  providers: [AppService, AppResolver],
})
export class AppModule {}
