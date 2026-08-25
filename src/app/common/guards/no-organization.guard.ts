import { selectLogedUser } from '../store/selectors';
import { createGuard } from './base.guard';

// Org-provisioned students already get access via their organization's plan;
// vouchers are for individually-registered students only.
export const NoOrganizationGuard = createGuard(
  selectLogedUser,
  (user) => !user?.organizationId,
  '/',
);
