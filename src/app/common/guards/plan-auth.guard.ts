import { selectUserActivePlan } from '../store/selectors';
import { createGuard } from '.';

export const PlanGuard = createGuard(
  selectUserActivePlan,
  (plan, route) => {
    const allowed = route.data?.['planes'];
    return !!(plan && Array.isArray(allowed) && allowed.includes(plan.code));
  },
  '/student/pricing',
);