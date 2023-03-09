import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
//import { Bank } from '../interfaces/bank.interface';


@Schema({ timestamps: true })
export class Qrcode {
    @Prop()
    link: string;
    @Prop()
    isProtected: boolean;
    @Prop({type: Object})
    data: any;
}

export const QrcodeSchema = SchemaFactory.createForClass(Qrcode)