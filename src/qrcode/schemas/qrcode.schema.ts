import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from "mongoose";
import { QrData } from '../interfaces/qrdata.interface';

export type QRDocument = Qrcode & Document;

@Schema({ timestamps: true })
export class Qrcode {
    @Prop()
    name: string;
    @Prop()
    link: string;
    @Prop()
    isProtected: boolean;
    @Prop({type : Object})//the data object is always store as an encrypted string 
    data: QrData;
}

export const QrcodeSchema = SchemaFactory.createForClass(Qrcode)