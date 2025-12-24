import { createReducer, on } from '@ngrx/store';
import { allUsersLoaded, loadAllUsers, loadOneUser, oneUserLoaded, toggleAllUsersSelection, toggleUserSelection } from '../actions';
import { InitialUsersState } from '../../models/states';

export const usersReducers = createReducer(
  InitialUsersState,
  on(loadAllUsers, (state) => {
    return {
      ...state,
      loading: true,
      loaded: false,
    };
  }),
  on(allUsersLoaded, (state, {users, total,}) => {
    return {
      ...state,
      users: users,
      total: total,
      loading: false,
      error: null,
    };
  }),
  on(loadOneUser, (state) => {
    return {
      ...state,
      loading: true,
      loaded: false,
    };
  }),
  on(oneUserLoaded, (state, {user}) => {
    return {
      ...state,
      selected: user,
      loading: false,
      loaded: true
    };
  }),
  on(toggleUserSelection, (state, { userId }) => ({
    ...state,
    users: (state.users ?? []).map(user => 
      user.id === userId ? { ...user, isSelected: !user.isSelected } : user
    )
  })),
  on(toggleAllUsersSelection, (state, { selected }) => ({
    ...state,
    users: (state.users ?? []).map(user => ({ ...user, isSelected: selected }))
  }))
);
