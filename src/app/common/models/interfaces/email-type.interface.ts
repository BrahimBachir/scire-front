export interface IEmailType {
    id: number;
    code: string;
    description: string;
    active: boolean;
    by_default: boolean;
    regex: string;
}