import { createSelector } from '@ngrx/store';
import { AppState } from '../app.store';
import { UsersState } from '../../models/states';

export const selectUsersState = (state: AppState) => state.users;

export const selectLoadingUsers = createSelector(
  selectUsersState,
  (state: UsersState) => state.loading
);

export const selectUsersLoading = createSelector(
    selectUsersState,
    (state: UsersState) => state.loading
  );

export const selectUsers = createSelector(
  selectUsersState,
  (state: UsersState) => state.users
);

export const selectTotalUsers = createSelector(
  selectUsersState,
  (state: UsersState) => state.total
);

export const selectSelectedUser = createSelector(
    selectUsersState,
    (state: UsersState) => state.selected
  );