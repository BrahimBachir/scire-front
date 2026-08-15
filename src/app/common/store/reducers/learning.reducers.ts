import { createReducer, on } from "@ngrx/store";
import { InitialLearningState } from "../../models/states";
import { loadCourse, setActiveCourse, setAllSelectedArticles, setSelectedArticle, setSelectedRule, setSelectedDiagram } from "../actions";


export const learningReducers = createReducer(
  InitialLearningState,
  on(loadCourse, (state, { course }) => {
    return {
      ...state,
      selectedCourse: course,
    };
  }),
  on(setActiveCourse, (state, { course }) => {
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
  on(setAllSelectedArticles, (state, { selectedArticlesIds }) => {
    return {
      ...state,
      selectedArticlesIds: selectedArticlesIds
    }
  }),
  on(setSelectedRule, (state, { rule }) => {
    return {
      ...state,
      selectedRule: rule
    }
  }),
  on(setSelectedDiagram, (state, { diagram }) => {
    return {
      ...state,
      selectedDiagram: diagram
    }
  })
);
