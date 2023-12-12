// main.ts or app.module.ts

import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { NestExpressApplication } from '@nestjs/platform-express';
import * as express from 'express';
import * as path from 'path';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  // Enable CORS for all routes
  app.enableCors();

  // Serve static files from the 'uploads' directory
  app.use('/uploads', express.static(path.join(__dirname, '..', 'uploads')));

  await app.listen(3000);
}
bootstrap();
