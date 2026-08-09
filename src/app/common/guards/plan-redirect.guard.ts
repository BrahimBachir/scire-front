import { inject } from '@angular/core';
import { Router, CanActivateFn } from '@angular/router';
import { Store } from '@ngrx/store';
import { Planes, Roles } from '../enums';
import {
  FRONT_ROUTE_TOKEN_SUPER,
  FRONT_ROUTE_TOKEN_STUDENT,
  FRONT_ROUTE_TOKEN_INSTRUCTOR,
} from '../config';
import { AppState } from '../store/app.store';
import { selectUserActivePlan } from '../store/selectors';

export const PlanRedirectGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
  let destination = '/basic-dashboard';
  let valid = false;

  return inject(Store<AppState>)
    .select(selectUserActivePlan)
    .subscribe({
      next: (plan) => {
        if (plan && plan.code === Planes.SILVER || plan && plan.code === Planes.GOLD) {
          destination = 'advanced-dashboard';
          valid = true;
        } else if (plan && plan.code === Planes.BRONZE) {
          valid = true;
        } else {
          return valid;
        }
        router.navigate([destination]);
        return valid;
      },
      //error: (error) => console.error(error),
    })
    ? true
    : false;
};
