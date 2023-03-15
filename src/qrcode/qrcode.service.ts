import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import mongoose from 'mongoose';
import { EncryptionService } from 'src/encryption/encryption.service';
import { CreateQrcodeDto } from './dto/CreateQrcode.dto';
import { DecryptQrcodeDto } from './dto/DecryptQrcode.dto';
import { Qrcode, QRDocument } from './schemas/qrcode.schema';

@Injectable()
export class QrcodeService {
    constructor(
        @InjectModel(Qrcode.name) 
        private QRModel: mongoose.Model<QRDocument>,
        private EncryptionService : EncryptionService
        ) {}

    async encryptQRData(qrcode: CreateQrcodeDto): Promise<string> {
        return await this.EncryptionService.encryptQRData(qrcode);
    }

    async decryptQRData(qrcode: DecryptQrcodeDto): Promise<string> {
        return await this.EncryptionService.decryptQRData(qrcode);
    }
    
    async findAll(): Promise<Qrcode[]> {
        return await this.QRModel.find();
    }

    async create(linkpartial: string, qrcodeDto: CreateQrcodeDto): Promise<Qrcode> {
        let qr = new this.QRModel()
        qr.link = linkpartial + qr._id;
        //check the type of isProtected and throw appropiate exception
        //check if pin is set and isProtected is not (if no pin is set the isProtected should be false)
        qr.isProtected = qrcodeDto.isProtected;
        qr.data = await this.encryptQRData(qrcodeDto)
        return await qr.save();
    }

    async findById(id: string, pin: string): Promise<Qrcode> {
        const qrcode = await this.QRModel.findById(id);
        if (!qrcode) return;
        if(qrcode.isProtected && !pin) return;
        qrcode.data = JSON.parse(await this.decryptQRData(qrcode));

        //TODO: validate pin {between 4 and 10 characters}

        //THROW EXCEPTION HERE AND CATCH THEM IN CONTROLLER THEN USE res.send to send appropiate message
        if(qrcode.data.pin === pin) return qrcode;
    }
    
    //TODO: handle update
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
