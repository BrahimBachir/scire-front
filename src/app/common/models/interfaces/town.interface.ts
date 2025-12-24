import { ICountry } from '.';

export interface ITown {
  id: number;
  code: string;
  description: string;
  order: number;
  country: ICountry;
}
