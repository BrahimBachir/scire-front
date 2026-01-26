import { IArticle, ICaller, ICourseCategory, ICourseType, IRule, IRuleAmbit, IRuleGazette, IRuleType } from ".";
import { FeatureType, VoteType } from "./feature-types";

export interface IQueryingDto {
    id?: number;
    skip?: number;
    take?: number;
    searchTerm?: string;
    parentId?: number;
    sortedBy?: string;
    totalCount?: number; // Optional, to hold the total count of items for pagination
    orderBy?: string;
    startDate?: Date;
    endDate?: Date;
    code?: string;
    type?: string;
    ruleCode?: string;
    ruleId?: number;
    articleId?: number;
    allParentIds?: number[];
    maxDifficulty?: number;
    minDifficulty?: number;
    ruleAmbitId?: number;
    ruleTypeId?: number;
    ruleGazetteId?: number;
    voteType?: VoteType
    featureType?: FeatureType
    featureId?: number;
    flashcardId?: number;
    videoId?: number;
    schemeId?: number;
    questionId?: number;
    noteId?: number;
    direction?: string;
    favorite?: boolean;
    callerId?: number;
    courseTypeId?: number;
    courseId?: number;
    topicId?: number;
    userId?: number;
    blockId?: number;
    courseCategoryId?: number;
}

export interface IFilters {
  ruleAmbitId?: IRuleAmbit | null;
  ruleTypeId?: IRuleType | null;
  ruleGazetteId?: IRuleGazette | null;
  search?: string | null;
  rule?: IRule | null;
  article?: IArticle | null;
  favorite?: boolean | null;
  caller?: ICaller | null;
  callerId?: number | null;
  courseType?: ICourseType | null;
  typeId?: number | null;
  courseCategory?: ICourseCategory | null;
  categoryId?: number | null;
  statusId?: number | null;
}

export type IFieldMode = 'EDITING' | 'CREATING' | 'FILTERING';

export type FilterKind =
  | 'searchTerm'
  | 'ruleAmbitId'
  | 'ruleGazetteId'
  | 'ruleTypeId'
  | 'rule'
  | 'ruleId'
  | 'ruleCode'
  | 'article'
  | 'articleId'
  | 'artiCode'
  | 'ternary'
  | 'courseId'
  | 'topicId'
  | 'topicCategoryId'
  | 'courseCategoryId'
  | 'sectionId'
  | 'callerId'
  | 'courseTypeId'
  | 'boolean';

export interface FilterConfig<T = unknown> {
  key: string;
  kind: FilterKind;
  label: string;

  dependsOn?: string;
  defaultValue?: T | null;

  editable?: boolean;
  
  debounceMs?: number;
  minLength?: number;
}

export type FilterState = Record<string, unknown>;

export interface AppFiltersState {
  search: string | null;
  rule: IRule | null;
  article: IArticle | null;
  favorite: boolean | null;
}

export type ApplyMode = 'auto' | 'manual';

export interface FiltersOptions {
  applyMode?: ApplyMode;
  ternaryFilterConfig?: TernaryFilterConfig;
  maxVisbleFields?: number
}

export interface TernaryItem {
  description: string,
  value: boolean | null
}

export interface TernaryFilterConfig {
  label: string;
  items: TernaryItem[]
}