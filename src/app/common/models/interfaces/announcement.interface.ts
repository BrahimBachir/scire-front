import { IAnnouncementRelevance } from "./announcement-relevance.interface";
import { ICourse } from "./course.interface";
import { IUser } from "./user.interface";

export interface IAnnouncement {
    id?: number;
    creator?: IUser;
    creatorId?: number;

    course?: ICourse;
    courseId?: number;
    
    content: string;
    title: string;

    createdAt: Date;

    views?: number;

    relevance: IAnnouncementRelevance;
    relevanceId: number;
}