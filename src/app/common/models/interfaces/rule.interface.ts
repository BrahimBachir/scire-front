import { IArticle, IGazette,  IRuleAmbit,  IRuleType } from ".";

export interface IRule {
    id: number;
    code: string;
    description: string;
    lastArticle?: string;
    internal?: boolean;
    repealed?: boolean;
    articles?: IArticle[];
    boeIndex?: IRuleIndex[];
    boeArticles?: any[];
    updateDate?: Date;
    enactmentDate?: Date;
    repealDate?: Date;
    effectiveDate?: Date;
    type?: IRuleType | null;
    gazette?: IGazette | null;
    ambit?: IRuleAmbit | null;
    readingTime?: number;
}

export interface IRuleIndex {
    id: string;
    titulo?: string;
    fecha_actualizacion?: string;
    url?: string;
    ruleCode?: string; 
}

export interface IMetadataSource {
    fecha_actualizacion: string;
    identificador: string;
    ambito: { codigo: string; texto: string; };
    rango: { codigo: string; texto: string; };
    fecha_disposicion: string; // Changed to string based on new input
    titulo: string;
    diario: string;
    fecha_publicacion: string; // Changed to string based on new input
    diario_numero: string; // Changed to string based on new input
    fecha_vigencia: string; // Changed to string based on new input
    estatus_derogacion: string;
    [key: string]: any;
}