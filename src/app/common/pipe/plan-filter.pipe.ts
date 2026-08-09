import { inject, Pipe, PipeTransform } from '@angular/core';
import { IElementAction } from '../data';
import { Store } from '@ngrx/store';
import { AppState } from '../store/app.store';
import { selectUserPlans } from '../store/selectors';
import { map, Observable } from 'rxjs';

@Pipe({
  name: 'planFilter',
  pure: true
})
export class PlanFilterPipe implements PipeTransform {
    store = inject(Store<AppState>)

  transform(actions: IElementAction[]): Observable<IElementAction[]> {
      return this.store.select(selectUserPlans).pipe(
          map(userPlans => {
              if (!actions) {
                return [];
              }

              const activePlanCodes = (userPlans ?? [])
                .filter(up => up?.active && up.plan)
                .map(up => up.plan.code);

              return actions.filter(action => {
                // If action has no plans restriction → visible to everyone
                if (!action.plans || action.plans.length === 0) {
                  return true;
                }

                // Otherwise check if any of the user's active plans is allowed
                return activePlanCodes.some(code => action.plans!.includes(code));
              });
          })
        );
  }
}
