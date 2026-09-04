import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { HttpModule } from '@nestjs/axios';
import { PuntoredModule } from './puntored/puntored.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }), // 👈 lee .env automáticamente
    HttpModule,
    PuntoredModule,
  ],
})
export class AppModule {}
