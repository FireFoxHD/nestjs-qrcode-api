import { QrData } from "../interfaces/qrdata.interface";

export class DecryptQrcodeDto {
    readonly name: string;
    readonly link: string;
    readonly isProtected: boolean;
    readonly data: QrData;
}
