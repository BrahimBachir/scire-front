import { FeatureType, VoteType } from "./feat-vote-types";

export interface QueryingDto {
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
    artiCode?: string;
    allParentIds?: number[];
    maxDifficulty?: number;
    minDifficulty?: number;
    ruleAmbit?: number;
    ruleType?: number;
    ruleGazette?: number;
    voteType?: VoteType
    featureType?: FeatureType
    featureId?: number;
    flashcardId?: number;
    schemeId?: number;
    questionId?: number;
    noteId?: number;
    direction?: string;
}