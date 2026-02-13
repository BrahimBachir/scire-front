import { ICourse } from "./course.interface";
import { ITopic } from "./topic.interface";

export interface ITopicCourse {
    id?: number;

    courseId: number;
    course?: ICourse;
    
    topicId: number;
    topic?: ITopic;
}