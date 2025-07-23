import * as dotenv from 'dotenv';
dotenv.config();

import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';



async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

 app.enableCors({
  origin: [
    'http://localhost:3000',
    'https://properties-proyect.vercel.app',
    'https://altos-alojamientos.com',
  ],
  credentials: true,
});

  app.useGlobalPipes(new ValidationPipe());

  app.useStaticAssets(join(__dirname, '..', 'uploads'), {
    prefix: '/uploads/',
  });

  //await app.listen(process.env.PORT ?? 3000); 
  const port = process.env.PORT ?? 4000;
  await app.listen(port, '0.0.0.0');
  console.log(`🚀 Backend corriendo en http://localhost:${port}`);
}
bootstrap();
