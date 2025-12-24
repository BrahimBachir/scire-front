import { createReducer, on } from "@ngrx/store";
import { InitialLearningState } from "../../models/states";
import { loadCourse } from "../actions/learning.actions";


export const learningReducers = createReducer(
  InitialLearningState,
  on(loadCourse, (state, { course }) => {
    return {
      ...state,
      selectedCourse: course,
    };
  })
);
