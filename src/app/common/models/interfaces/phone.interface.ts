import { IPhoneType } from ".";

export interface IPhone {
    id: number;
    code: string;
    description: string;
    type?: IPhoneType;
    number: string;
    active: boolean;
    by_default?: boolean;
}