import { Body, Controller, Delete, Get, Param, Post, Req } from '@nestjs/common';
import { Request } from 'express'
import { CreateQrcodeDto } from './dto/CreateQrcode.dto';
import { QrcodeService } from './qrcode.service';
import { Qrcode } from './schemas/qrcode.schema';

@Controller('qrcode')
export class QrcodeController {
    constructor(
        private qrCodeService: QrcodeService,
    ) {}

    @Get()
    async getAllQrcode(): Promise<Qrcode[]> {
      return this.qrCodeService.findAll();
    }

    @Get('/:id') 
    async getQrcode( @Req() req: Request, @Param('id') id: string): Promise<Qrcode> {
      if(!req.body.hasOwnProperty('pin')) req.body.pin = "";
      return this.qrCodeService.findById(id, req.body.pin);
    }

    @Post('create')
    async createQrcode(@Body() qrcodeDto: CreateQrcodeDto,@Req() req: Request ): Promise<Qrcode> {
      let linkpartial = `${req.protocol}://${req.get('Host')}/qrcode/`
      return this.qrCodeService.create(linkpartial, qrcodeDto);
    }

    //check if user is authorized
    @Delete()
    async deleteQrcode(@Req() req: Request ): Promise<Qrcode> {
      return this.qrCodeService.deleteById(req.body.id);
    }
}
