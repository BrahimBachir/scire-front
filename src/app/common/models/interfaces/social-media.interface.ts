import { ISocialMediaBrand } from '.';

export interface ISocialMedia {
  id: number;
  brand: ISocialMediaBrand;
  href: string;
  visible: boolean;
}