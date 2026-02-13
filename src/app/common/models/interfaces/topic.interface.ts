import { Source, IGanttTask, ISection, IMermaid, IVideo, IBlock, ITopicProgress } from ".";

export interface ITopic {
    id: number;
    name: string;
    code?: string;
    description: string;
    section?: ISection;
    sectionId?: number;
    summary: string;
    sources: Source[];
    mermaids: IMermaid[];
    videos: IVideo[];
    scaffolder: string;
    tasks?: IGanttTask[];
    blocks?: IBlock[];
    isEnded?: boolean;
    progress?: ITopicProgress;
    courseId?: number;
}