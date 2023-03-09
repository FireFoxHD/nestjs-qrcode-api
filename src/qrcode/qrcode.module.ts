import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { EncryptionService } from 'src/encryption/encryption.service';
import { QrcodeController } from './qrcode.controller';
import { QrcodeService } from './qrcode.service';
import { QrcodeSchema } from './schemas/qrcode.schema';

@Module({
  imports: [MongooseModule.forFeature([{name: 'Qrcode', schema: QrcodeSchema }])],
  controllers: [QrcodeController],
  providers: [QrcodeService, EncryptionService]
})


export class QrcodeModule {}
