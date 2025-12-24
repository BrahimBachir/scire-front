import { IPlanFeatures } from ".";

export interface IPlan {
    id: number;
    code: string;
    description: string;
    popular: boolean;
    image: string;
    price: number;
    plan_features: IPlanFeatures[]
}