import { createAction } from "@ngrx/store";
import { ICourse } from "../../models/interfaces";

export const LOAD_COURSE = '[LEARNING] Load course!';
export const COURSE_LOADED = '[LEARNING] Course loaded!';

export const loadCourse = createAction(
  LOAD_COURSE,
  (
    course: ICourse
  ) => ({ course})
);

export const courseLoaded = createAction(COURSE_LOADED);
