import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import mongoose from 'mongoose';
import { EncryptionService } from 'src/encryption/encryption.service';
import { Qrcode } from './schemas/qrcode.schema';



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

    async create(qrcode: Qrcode): Promise<Qrcode> {
        const res = await this.QRModel.create(qrcode);
        return res;
    }

    async findById(id: string, pin: string): Promise<Qrcode> {
        const qrcode = await this.QRModel.findById(id);
        if (!qrcode) throw new NotFoundException('Qrcode not found.');
        if(!qrcode.isProtected) return qrcode;
        const decryptedCode = await this.decrypt(qrcode);
        if(decryptedCode.data.pin == pin) return decryptedCode;
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
}
