import { IFeature } from ".";
import { IPlan } from ".";

export interface IPlanFeatures {
can_create: boolean; 
can_download: boolean;
can_edit: boolean;
can_hide: boolean;
code: string
daily_limit: number
description: string;
feat_available: boolean;
feature: IFeature;
id: number;
monthly_limit: number
plan?: IPlan;
total_limit: number;
weekly_limit: number;
}