import { createSelector } from '@ngrx/store';
import { AppState } from '../app.store';
import { LearningState } from '../../models/states';

export const selectLearningState = (state: AppState) => state.learning

export const selectChoosenCourse = createSelector(
  selectLearningState,
  (state: LearningState) => state.selectedCourse
);