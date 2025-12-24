import { ActionReducerMap, MetaReducer } from '@ngrx/store';

import {
  authReducer,
  hydrationMetaReducer,
  usersReducers,
} from './reducers';
import { AuthState, LearningState, UsersState } from '../models/states';
import { learningReducers } from './reducers/learning.reducers';


export interface AppState {
  auth: AuthState;
  users: UsersState;
  learning: LearningState
}

export const ROOT_REDUCERS: ActionReducerMap<AppState> = {
  auth: authReducer,
  users: usersReducers,
  learning: learningReducers
};

export const metaReducers: MetaReducer[] = [hydrationMetaReducer];
