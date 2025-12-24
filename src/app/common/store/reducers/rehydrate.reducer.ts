import { ActionReducer, INIT, UPDATE } from '@ngrx/store';
import { START_LOGOUT } from '../actions';
import { AppState } from '../app.store';
import { InitialAppState } from '../../models/states';

export const hydrationMetaReducer = (
  reducer: ActionReducer<AppState>
): ActionReducer<AppState> => {
  return (state, action) => {
    if (action.type === INIT || action.type === UPDATE) {
      const storageValue = localStorage.getItem('state');
      if (storageValue) {
        try {
          return JSON.parse(storageValue);
        } catch {
          localStorage.removeItem('state');
        }
      }
    } else if (action.type === START_LOGOUT) {
      state = InitialAppState;
      localStorage.removeItem('state');
    }
    const nextState = reducer(state, action);
    localStorage.setItem('state', JSON.stringify(nextState));
    return nextState;
  };
};
