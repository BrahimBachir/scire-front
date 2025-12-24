import { IEmailType } from '.';

export interface IEmail {
    id: number;
    code: string;
    description: string;
    type?: IEmailType;
    value: string;
    active?: boolean;
    by_default?: boolean;
}