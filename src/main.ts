import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  app.enableCors();

  //instalamos las librerias npm i class-validator class-transformer
    // sirven para parsear la info que llega del body
    // y añadimos el siguiente codigo
    // hace restrictivo la informacion de nuestro backend
  app.useGlobalPipes(
    new ValidationPipe({
    whitelist: true,
    forbidNonWhitelisted: true,
    })
  );
  
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
