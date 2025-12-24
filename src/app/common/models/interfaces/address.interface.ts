import { IAddressType, ICountry, ITown } from '.';

export interface IAddress {
  id: number;
  code: string;
  type?: IAddressType;
  country?: ICountry;
  town?: ITown;
  street: string;
  number: number;
  other_info: string;
  postal_code: string;
  active?: boolean;
  by_default?: boolean;
}
