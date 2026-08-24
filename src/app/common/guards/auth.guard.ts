import { selectLogedIn } from '../store/selectors';
import { createGuard } from './base.guard';

export const AuthGuard = createGuard(
  selectLogedIn,
  (isLoggedIn) => !!isLoggedIn,
  '/auth',
);