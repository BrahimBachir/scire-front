import { selectLogedIn } from '../store/selectors';
import { createGuard } from '.';

export const AuthGuard = createGuard(
  selectLogedIn,
  (isLoggedIn) => !!isLoggedIn,
  '/auth',
);