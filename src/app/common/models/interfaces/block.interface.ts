import { IGazette,  IRuleAmbit,  IRule } from ".";

export interface IBlock {
    id: number;
    description: string;
    articles: IBlockArticles[];
    rule?: IRule | null;
    gazette?: IGazette | null;
    ambit?: IRuleAmbit | null;
}


export interface IBlockArticles {
    id: number;
    code: string
    ruleCode: string;
}