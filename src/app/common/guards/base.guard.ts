import { inject } from '@angular/core';
import { CanActivateFn, Router, ActivatedRouteSnapshot } from '@angular/router';
import { Store, MemoizedSelector } from '@ngrx/store';
import { map, take, tap, Observable } from 'rxjs';

/**
 * A generic factory to create Guards.
 * @param selector The NgRx selector to get data from the store
 * @param predicate A function to check if the data meets the route requirements
 * @param redirectRoute The URL to navigate to if validation fails
 */
export const createGuard = <T>(
  selector: MemoizedSelector<any, T>,
  predicate: (data: T, route: ActivatedRouteSnapshot) => boolean,
  redirectRoute: string,
): CanActivateFn => {
  return (route) => {
    const store = inject(Store);
    const router = inject(Router);

    return store.select(selector).pipe(
      take(1),
      map((data) => ({
        isValid: predicate(data, route),
        data,
      })),
      tap(({ isValid }) => {
        if (!isValid) {
          router.navigate([redirectRoute]);
        }
      }),
      map(({ isValid }) => isValid),
    );
  };
};
