import { IPlan, IUser } from ".";

export interface IUserPricingPlan {
  user?: IUser;
  userId?: number;
  plan: IPlan;
  planId?: number;
  annualy: boolean;
  monthly: boolean;
  paid: boolean;
  valid_to: Date;
  active: boolean;
}