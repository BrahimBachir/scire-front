import { ICategory } from "./category.interface";

export interface ISection {
  id: number;
  name: string;
  code?: string;
  category: ICategory;
}