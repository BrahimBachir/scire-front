import { selectUserRole } from '../store/selectors';
import { createGuard } from '.';

export const RoleGuard = createGuard(
  selectUserRole,
  (role, route) => role?.code === route.data?.['role'],
  '/auth/unauthorized',
);