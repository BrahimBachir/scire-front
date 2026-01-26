import { createAction } from "@ngrx/store";
import { IArticle, ICourse, IRule, IScheme } from "../../models/interfaces";

export const LOAD_COURSE = '[LEARNING] Load course!';
export const COURSE_LOADED = '[LEARNING] Course loaded!';

export const SET_SELECTED_RULE = '[LEARNING] New selected rule';
export const SET_SELECTED_SCHEME = '[LEARNING] New selected scheme';
export const SET_SELECTED_ARTICLE = '[LEARNING] New selected article';
export const SET_ALL_SELECTED_ARTICLES = '[LEARNING] New multiple selected articles';

export const loadCourse = createAction(
  LOAD_COURSE,
  (
    course: ICourse
  ) => ({ course})
);

export const courseLoaded = createAction(COURSE_LOADED);


export const setSelectedRule = createAction(
  SET_SELECTED_RULE,
  (
    rule: IRule
  ) => ({ rule })
);

export const setSelectedScheme = createAction(
  SET_SELECTED_SCHEME,
  (
    scheme: IScheme
  ) => ({ scheme })
);

export const setSelectedArticle = createAction(
  SET_SELECTED_ARTICLE,
  (
    article: IArticle
  ) => ({ article })
);

export const setAllSelectedArticles = createAction(
  SET_ALL_SELECTED_ARTICLES,
  (
    articles: IArticle[]
  ) => ({ articles })
);