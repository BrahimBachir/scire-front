import { ITopicCategory } from "./topic-category.interface";

export interface ISection {
  id: number;
  name: string;
  code?: string;
  category: ITopicCategory;
}