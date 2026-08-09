import { IArticle, IRuleGazette, IRuleAmbit, IRuleType } from ".";

export interface IRule {
  id: number;
  code: string;
  description: string;
  internal?: boolean;
  repealed?: boolean;
  articles?: IArticle[];
  boeIndex?: IRuleIndex[];
  updateDate?: Date;
  enactmentDate?: Date;
  repealDate?: Date;
  effectiveDate?: Date;
  type?: IRuleType | null;
  typeId?: number;
  gazette?: IRuleGazette | null;
  gazetteId?: number;
  ambit?: IRuleAmbit | null;
  ambitId?: number;
  readingTime?: number;
  fromBOE?: boolean;
  creatorId?: number;
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
  fecha_disposicion: string;
  titulo: string;
  diario: string;
  fecha_publicacion: string;
  diario_numero: string;
  fecha_vigencia: string;
  estatus_derogacion: string;
  [key: string]: any;
}