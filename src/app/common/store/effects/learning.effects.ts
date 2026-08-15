import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import {
  catchError,
  concatMap,
  exhaustMap,
  filter,
  map,
  withLatestFrom,
} from 'rxjs/operators';
import { Router } from '@angular/router';
import { loadCourse, setActiveCourse } from '../actions/learning.actions';
import { logedUserLoaded } from '../actions/auth.actions';
import { selectChoosenCourse } from '../selectors/learning.selectors';
import { AppState } from '../app.store';
import { CourseService } from 'src/app/services';
import { ICourse } from '../../models/interfaces';
import { EMPTY, from } from 'rxjs';

@Injectable()
export class LearningEffects {
  constructor(
    private actions$: Actions,
    private store: Store<AppState>,
    private courseService: CourseService,
    public router: Router,
  ) { }

  loadSelectedCourse$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(loadCourse),
        concatMap(({ course }) =>
          from(this.router.navigate([`student/courses/${course.id}/details`])).pipe(
            catchError((error) => {
              //console.error('[LEARNING] Error:', error);
              return EMPTY;
            })
          )
        )
      ),
    { dispatch: false }
  );

  loadLastActiveCourse$ = createEffect(() =>
    this.actions$.pipe(
      ofType(logedUserLoaded),
      withLatestFrom(this.store.select(selectChoosenCourse)),
      filter(([, current]) => !current || current.id === 0),
      exhaustMap(() =>
        this.courseService.getLastActiveCourse().pipe(
          filter((course): course is ICourse => !!course),
          map((course) => setActiveCourse(course)),
          catchError(() => EMPTY)
        )
      )
    )
  );
}