import { FeatureType, ICourse, IFlashcard, IQuestion, IRule, IScheme, IUser } from ".";

export interface IReview {
    id?: number;
    user?: IUser;
    userId?: number;
    featureId: number;
    scheme?: IScheme;
    flashcard?: IFlashcard;
    course?: ICourse;
    question?: IQuestion;
    rule?: IRule;
    featureType: FeatureType;
    rating: number;
    reviewText: string;
}

export interface IReviewSummary {
    averageRating: number;
    ratingCount: number;
    starDistribution: IRateRow;
}

export interface IRate {
    label: number;
    value: number;
    count: number
}

export interface IRateRow {
  [key: string]: number;
}