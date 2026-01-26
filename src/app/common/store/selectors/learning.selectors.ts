import { createSelector } from '@ngrx/store';
import { AppState } from '../app.store';
import { LearningState } from '../../models/states';

export const selectLearningState = (state: AppState) => state.learning

export const selectChoosenCourse = createSelector(
  selectLearningState,
  (state: LearningState) => state.selectedCourse
);

export const getSelectedRule = createSelector(
  selectLearningState,
  (state: LearningState) => state.selectedRule
);

export const getSelectedArticle = createSelector(
  selectLearningState,
  (state: LearningState) => state.selectedArticle
);

export const getSelectedScheme = createSelector(
  selectLearningState,
  (state: LearningState) => state.selectedScheme
);

export const getAllSelectedArticles = createSelector(
  selectLearningState,
  (state: LearningState) => state.allSelectedArticle
);