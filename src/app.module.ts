import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { QrcodeModule } from './qrcode/qrcode.module';
import { EncryptionService } from './encryption/encryption.service';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';

@Module({
  imports: [    
    ConfigModule.forRoot({
      envFilePath: '.env',
      isGlobal: true,
    }),
    MongooseModule.forRoot(process.env.DB_URI),
    QrcodeModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
