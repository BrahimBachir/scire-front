import { IUser } from "../interfaces";

export interface AuthState {
  token: string;
  user: IUser;
  code: string;
  logedIn?: boolean;
  semiLogedIn?: boolean;
  verifying?: boolean;
  verifyingEmail?: boolean;
}