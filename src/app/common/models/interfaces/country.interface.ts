import { ILanguage } from "./language.interface";

export interface ICountry {
  id: number;
  code: string;
  description: string;
  code_alpha_3: string;
  latitude: number;
  longitude: number;
  altitude: number;
  phone_code: string;
  top_level_domain: string;
  language: ILanguage;
  active: boolean;
}
