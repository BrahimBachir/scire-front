//import { SysConfState } from './base-config.state';

import { AuthState, LearningState, UsersState } from ".";

export interface AppInitState {
  auth: AuthState;
  users: UsersState;
  learning: LearningState;
}
