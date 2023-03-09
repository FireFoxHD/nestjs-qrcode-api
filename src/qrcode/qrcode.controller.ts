import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { EncryptionService } from 'src/encryption/encryption.service';
import { QrcodeDto } from './dto/create-qrcode.dto';
import { QrcodeService } from './qrcode.service';
import { Qrcode } from './schemas/qrcode.schema';

@Controller('qrcode')
export class QrcodeController {
    constructor(
        private qrCodeService: QrcodeService,
    ) {}

    @Get()
    hello(): string {
      return "hello"
    }

    @Post('encrypt')
    async encryptQrcodes(@Body() qrcodeDto: QrcodeDto): Promise<Qrcode> {
      return this.qrCodeService.encrypt(qrcodeDto);
    }

    @Post('decrypt')
    async decryptQrcodes(@Body() qrcodeDto: QrcodeDto): Promise<Qrcode> {
      return this.qrCodeService.decrypt(qrcodeDto);
    }

    @Get()
    async getAllQrcode(): Promise<Qrcode[]> {
      return this.qrCodeService.findAll();
    }

    @Get('/:id/:pin') //possible ../qrcode/12314&1111
    async getQrcode(@Param() params): Promise<Qrcode> {
      return this.qrCodeService.findById(params.id, params.pin);
    }

    @Post('create')
    async createQrcode(@Body() qrcodeDto: QrcodeDto): Promise<Qrcode> {
      return this.qrCodeService.create(qrcodeDto);
    }

    
}
