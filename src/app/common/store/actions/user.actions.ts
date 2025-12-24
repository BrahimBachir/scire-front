import { createAction, props } from '@ngrx/store';
import { IUser, QueryingDto } from '../../models/interfaces';

export const CREATE_USER = '[USERS] Create user';
export const USER_CREATED = '[USERS] Create user';
export const DELETE_USER = '[USERS] Delete user';
export const DELETE_USERS = '[USERS] Delete many user';
export const USER_DELETED = '[USERS] User deleted';
export const USERS_DELETED = '[USERS] Many user deleted';
export const UPDATE_USER = '[USERS] Update user';
export const USER_UPDATED = '[USERS] User updated';
export const LOAD_ALL_USERS = '[USERS] Get all users';
export const LOAD_ONE_USER = '[USERS] Get one user';
export const ALL_USERS_LOADED = '[USERS] All users loaded';
export const ONE_USER_LOADED = '[USERS] User loaded';
export const USERS_DELETIN_GERROR= "[USERS] The User/s can't be deleted";

export const LOAD_LOGGED_USER = '[USERS] Get logged user';
export const LOGGED_USER_LOADED = '[USERS] Logged user loaded';

export const TOGGLE_USER_SELECTION = '[USERS] Toggle User Selection';
export const TOGGLE_ALL_USERS_SELECTION = '[USERS] Toggle All Users Selection';


export const createUser = createAction(CREATE_USER, props<{ user: IUser }>());

export const userCreated = createAction(USER_CREATED, (user: IUser) => ({
  user,
}));

export const updateUser = createAction(UPDATE_USER, props<{ user: IUser }>());

export const userUpdated = createAction(USER_UPDATED, (user: IUser) => ({
  user,
}));

export const deleteUser = createAction(DELETE_USER, props<{ id: number }>());

export const deleteManyUser = createAction(
  DELETE_USERS,
  props<{ ids: number[] }>()
);

export const userDeleted = createAction(USER_DELETED);

export const manyUsersDeleted = createAction(USERS_DELETED);
export const usersDeletingError = createAction(USERS_DELETIN_GERROR);

export const loadAllUsers = createAction(LOAD_ALL_USERS, (queryingDto: QueryingDto) => ({
  queryingDto,
}));

export const loadOneUser = createAction(
  LOAD_ONE_USER,
  props<{ id: number}>()
);

export const allUsersLoaded = createAction(ALL_USERS_LOADED, (users: IUser[], total: number) => ({
  users,
  total,
}));

export const oneUserLoaded = createAction(ONE_USER_LOADED, (user: IUser) => ({
  user
}));

export const loadLoggedUser = createAction(
  LOAD_LOGGED_USER,
  props<{ code: string }>()
);

export const loggedUserLoaded = createAction(
  LOGGED_USER_LOADED,
  (user: IUser) => ({ user })
);

export const toggleUserSelection = createAction(
  TOGGLE_USER_SELECTION,
  props<{ userId: number }>()
);

export const toggleAllUsersSelection = createAction(
  TOGGLE_ALL_USERS_SELECTION,
  props<{ selected: boolean }>()
);
