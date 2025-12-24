import { IUser } from "../interfaces";

export interface UsersState {
    users: IUser[] | null;
    selected: IUser;
    total: number;
    loading?: boolean;
    error?: any;
  }