import { QrData } from "../interfaces/qrdata.interface";

export class CreateQrcodeDto {
  readonly name: string;
  readonly isProtected: boolean;
  readonly data: QrData;
}