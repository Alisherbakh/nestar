import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { LoggingInterceptor } from './libs/interceptor/Logging.interceptor';
import { graphqlUploadExpress } from 'graphql-upload';
import * as express from 'express';

async function bootstrap() {  // loyiha ildizi ekan bootstrap function
  const app = await NestFactory.create(AppModule); // Appmodel calling va integratsiyasi nestjs + express
  app.useGlobalPipes(new ValidationPipe()); //validation pipes global integratsiyasi class dan instens olib
  app.useGlobalInterceptors(new LoggingInterceptor()); // logging interseptor integratsiyasi
  app.enableCors({ origin: true, credentials: true });
  // ixtiyoriy requestlarni qabul qilishini aytyabmiz, upload img uchun integratsiya

  app.use(graphqlUploadExpress({ maxFileSize: 15000000, maxFiles: 10 }));
  // yuklanyotgan malumotlarga limit qoyadi
  app.use('/uploads', express.static('./uploads'));
  // upload folderni tashqi olamga ochiqlayabmiz

  await app.listen(process.env.PORT_API ?? 3000);  // calling port manzil
}
bootstrap();
 