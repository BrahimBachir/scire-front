import { ICourse } from "./course.interface";
import { FeatureType } from "./feature-types";
import { IRule } from "./rule.interface";
import { IUser } from "./user.interface";

export interface IComment {
    id?: number;
    creator?: IUser;
    creatorId?: number;
    featureId: number;
    course?: ICourse;
    rule?: IRule;
    featureType: FeatureType;
    parent?: IComment;
    parentId?: number;
    content: string;
    createdAt?: Date;
    replies?: IComment[];
}