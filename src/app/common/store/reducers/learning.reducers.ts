import { createReducer, on } from "@ngrx/store";
import { InitialLearningState } from "../../models/states";
import { loadCourse, setAllSelectedArticles, setSelectedArticle, setSelectedRule, setSelectedScheme } from "../actions";


export const learningReducers = createReducer(
  InitialLearningState,
  on(loadCourse, (state, { course }) => {
    return {
      ...state,
      selectedCourse: course,
    };
  }),
  on(setSelectedArticle, (state, { article }) => {
    return {
      ...state,
      selectedArticle: article
    }
  }),
  on(setAllSelectedArticles, (state, { articles }) => {
    return {
      ...state,
      allSelectedArticle: articles
    }
  }),
  on(setSelectedRule, (state, { rule }) => {
    return {
      ...state,
      selectedRule: rule
    }
  }),
  on(setSelectedScheme, (state, { scheme }) => {
    return {
      ...state,
      selectedScheme: scheme
    }
  })
);
