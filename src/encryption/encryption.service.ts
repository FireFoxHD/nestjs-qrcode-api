import { createCipheriv, createDecipheriv, createHash, randomBytes } from 'crypto';
import { Injectable } from '@nestjs/common';
import { Qrcode } from 'src/qrcode/schemas/qrcode.schema';
import { CreateQrcodeDto } from 'src/qrcode/dto/CreateQrcode.dto';
import { DecryptQrcodeDto } from 'src/qrcode/dto/DecryptQrcode.dto';
// import { Qrcode } from 'src/qrcode/schemas/qrcode.schema';


        
@Injectable()
export class EncryptionService {
    
    iv: Buffer;
    key: string;
    
    constructor(){
        this.iv = Buffer.from(randomBytes(16).toString("hex").slice(0, 16))
        this.key = createHash('sha256').update(String(process.env.HASHKEY)).digest('base64').slice(0, 32);
    }

    async encrypt(textToEncrypt: string): Promise<string> {
        const cipher = createCipheriv('aes-256-cbc', Buffer.from(this.key), this.iv);
        let encryptedData = this.iv + cipher.update(textToEncrypt, "utf-8", "hex");
        encryptedData += cipher.final("hex");
        return encryptedData
    }

    async decrypt(encryptedText: any): Promise<string> {
        let text = encryptedText.replaceAll("\"", ""); 
        const iv = text.slice(0, 16);
        const decipher = createDecipheriv('aes-256-cbc', Buffer.from(this.key), iv);
        let decryptedData = decipher.update(text.slice(16), "hex", "utf-8");
        decryptedData += decipher.final("utf8");
        return decryptedData
    }

    async encryptQRData(qrcode: CreateQrcodeDto): Promise<string> {
        let data = JSON.stringify(qrcode.data);
        const cipher = createCipheriv('aes-256-cbc', Buffer.from(this.key), this.iv);
        let encryptedData = this.iv + cipher.update(data, "utf-8", "hex");
        encryptedData += cipher.final("hex");
        return encryptedData

    }

    async decryptQRData(qrcode: DecryptQrcodeDto): Promise<string> {
        let text = qrcode.data.replaceAll("\"", ""); 
        const iv = text.slice(0, 16);
        const decipher = createDecipheriv('aes-256-cbc', Buffer.from(this.key), iv);
        let decryptedData = decipher.update(text.slice(16), "hex", "utf-8");
        decryptedData += decipher.final("utf8");
        return decryptedData
    }
}
