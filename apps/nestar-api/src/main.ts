import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { LoggingInterceptor } from './libs/interceptor/Logging.interceptor';

async function bootstrap() {
  const app = await NestFactory.create(AppModule); // Appmodel calling va integratsiyasi nestjs + express
  app.useGlobalPipes(new ValidationPipe()); // validation pipes global integratsiyasi
  app.useGlobalInterceptors(new LoggingInterceptor()); // logging interseptor integratsiyasi
  await app.listen(process.env.PORT_API ?? 3000);
}
bootstrap();
 