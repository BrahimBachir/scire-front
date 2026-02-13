import { ITopicCategory } from "./topic-category.interface";

export interface ISection {
  id: number;
  name: string;
  description: string;
  code?: string;
  category: ITopicCategory;
  categoryId?: number;
}