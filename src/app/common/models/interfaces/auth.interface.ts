import { IUser } from "./user.interface";


export interface IAuth {
  id: number;
  token: string;
  tokenExpirationTime: number;
  user: IUser;
  id_company: number;
  logedIn?: boolean;
  verifying?: boolean;
}