import { Bank } from "../interfaces/bank.interface";

export class QrcodeDto {
  readonly link: string;
  readonly isProtected: boolean;
  readonly data: Object;
}