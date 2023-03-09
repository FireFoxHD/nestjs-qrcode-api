import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import mongoose from 'mongoose';
import { EncryptionService } from 'src/encryption/encryption.service';
import { QrcodeDto } from './dto/create-qrcode.dto';
import { Qrcode } from './schemas/qrcode.schema';
import {Request} from 'express'



@Injectable()
export class QrcodeService {
    constructor(
        @InjectModel(Qrcode.name) 
        private QRModel: mongoose.Model<Qrcode>,
        private EncryptionService : EncryptionService
        ) {}

    async encrypt(qrcode: Qrcode): Promise<Qrcode> {
        const encryptedCode = await this.EncryptionService.encrypt(JSON.stringify(qrcode.data));
        return {
            isProtected: qrcode.isProtected,
            link: qrcode.link,
            data: {encryptedCode}
        };
    }

    async decrypt(qrcode: Qrcode): Promise<Qrcode> {
    
        const decryptedCode = await this.EncryptionService.decrypt(JSON.stringify(qrcode.data.encryptedCode));
        return {
            isProtected: qrcode.isProtected,
            link: qrcode.link,
            data: JSON.parse(decryptedCode)
        };
    }
    
    async findAll(): Promise<Qrcode[]> {
        const qrcodes = await this.QRModel.find();
        return qrcodes;
    }

    async create(req: Request, qrcodeDto: QrcodeDto): Promise<Qrcode> {
        // console.log(this.encrypt(qrcode));
        const res = await this.QRModel.create(await this.encrypt(qrcodeDto));
        const link = this.createLink(req, res);
        res.link = link
        return res;
    }

    async findById(req: Request, params: {id: string, pin: string}): Promise<Qrcode> {
        const qrcode = await this.QRModel.findById(params.id);
        if (!qrcode) throw new NotFoundException('Qrcode not found.');
        const link = this.createLink(req, qrcode);
        qrcode.link = link
        if(!qrcode.isProtected) return qrcode;
        const decryptedCode = await this.decrypt(qrcode);
        if(decryptedCode.data.pin == params.pin) return decryptedCode;
        throw new DOMException('Incorrect Pin.');
    }
    
    async updateById(id: string, qrcode: Qrcode): Promise<Qrcode> {
        return await this.QRModel.findByIdAndUpdate(id, qrcode, {
          new: true,
          runValidators: true,
        });
    }

    async deleteById(id: string): Promise<Qrcode> {
        return await this.QRModel.findByIdAndDelete(id);
    }
    
    createLink(req: any, qrcode: any): string{
        const id = qrcode._id;
        return `${req.protocol}://${req.get('Host')}/qrcode/${id}`
    }
}
