import { IPhone, IEmail, IAddress, IRole, IPermit, IGender } from '.';

export interface IUser {
  id?: number;
  full_name?: string;
  image?: string;
  emails?: IEmail[];
  phones?: IPhone[];
  addresses?: IAddress[];
  role: IRole;
  gender: IGender;
  permits?: IPermit[];
  code?: string;
  title?: string;
  active?: boolean;
  name?: string;
  first_surname?: string;
  birth_date?: string;
  second_surname?: string;
  isSelected?: boolean;
  token?: string;
}
