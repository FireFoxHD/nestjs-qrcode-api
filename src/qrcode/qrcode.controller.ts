import { Body, Controller, Get, Param, Post, Req } from '@nestjs/common';
import { EncryptionService } from 'src/encryption/encryption.service';
import {Request} from 'express'
import { QrcodeDto } from './dto/create-qrcode.dto';
import { QrcodeService } from './qrcode.service';
import { Qrcode } from './schemas/qrcode.schema';

@Controller('qrcode')
export class QrcodeController {
    constructor(
        private qrCodeService: QrcodeService,
    ) {}


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
    async getQrcode( @Req() req: Request, @Param() params: {id: string, pin: string}): Promise<Qrcode> {
      return this.qrCodeService.findById(req, params);
    }

    @Post('create')
    async createQrcode(@Body() qrcodeDto: QrcodeDto,@Req() req: Request ): Promise<Qrcode> {
      return this.qrCodeService.create(req, qrcodeDto);
    }

    
}
