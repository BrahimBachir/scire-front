import { Source, IGanttTask, ISection, IMermaid, IVideo, IBlock } from ".";

export interface ITopic {
    id: number;
    name: string;
    description: string;
    section?: ISection;
    summary: string;
    sources: Source[];
    mermaids: IMermaid[];
    videos: IVideo[];
    scaffolder: string;
    tasks?: IGanttTask[];
    blocks?: IBlock[];
    isEnded?: boolean;
    progress?: number;
}


export interface IIncomingTopics {
    total: number;
    rows: ITopic[];
}
