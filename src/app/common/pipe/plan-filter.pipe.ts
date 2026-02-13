import { inject, Pipe, PipeTransform } from '@angular/core';
import { IElementAction } from '../data';
import { Store } from '@ngrx/store';
import { AppState } from '../store/app.store';
import { selectUserPlans } from '../store/selectors';
import { map } from 'rxjs';

@Pipe({
  name: 'planFilter',
  pure: true
})
export class PlanFilterPipe implements PipeTransform {
    store = inject(Store<AppState>)

  transform(actions: IElementAction[]): IElementAction[] {
      if (!actions) {
        return [];
      }
      
      let filteredActions: IElementAction[] = [];
      
      this.store.select(selectUserPlans).pipe(
          map(userPlans => {
              return userPlans?.flatMap(up => {
                  // If no plan info yet, just return actions that are available to everyone
                  if (!up || !up.plan) {
                      return actions.filter(a => !a.plans);
                    }
                if(up.active){
                    return actions.filter(action => {
                      // If action has no plans restriction → visible to everyone
                      if (!action.plans || action.plans.length === 0) {
                        return true;
                      }
                
                      // Otherwise check if user plan is allowed
                      return action.plans.includes(up.plan.code);
                    });                    
                }
                return [];
            }) || [];
          })
        ).subscribe(result => {
          filteredActions = result;
        });

      return filteredActions;
  }
}
