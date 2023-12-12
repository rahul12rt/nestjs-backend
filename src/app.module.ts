// src/app.module.ts
import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { BackgroundRemovalController } from './background-removal/background-removal.controller';

@Module({
  imports: [],
  controllers: [AppController, BackgroundRemovalController],
  providers: [AppService],
})
export class AppModule {}
