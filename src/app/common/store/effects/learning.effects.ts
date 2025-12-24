import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import {
  catchError,
  concatMap,
} from 'rxjs/operators';
import { Router } from '@angular/router';
import { loadCourse } from '../actions/learning.actions';
import { EMPTY, from, of } from 'rxjs';

@Injectable()
export class LearningEffects {
  constructor(
    private actions$: Actions,
    public router: Router,
  ) { }

  loadSelectedCourse$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(loadCourse),
        concatMap(({ course }) =>
          from(this.router.navigate([`student/courses/${course.id}/details`])).pipe(
            catchError((error) => {
              console.error('[LEARNING] Error:', error); 
              return EMPTY;
            })
          )
        )
      ),
    { dispatch: false }
  );
}