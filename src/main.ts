import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe({
    // Only use elements which are specified. No extra variables.
    whitelist: true
  }));
  await app.listen(3333);
}
bootstrap();
