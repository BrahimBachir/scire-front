

import {  Pipe, PipeTransform } from '@angular/core';
import { Store } from '@ngrx/store';
import { AppState } from '../store/app.store';
import { selectUserPermits } from '../store/selectors';
import { map, Observable } from 'rxjs';

@Pipe({ name: 'accessControl' })
export class ControlAccessPipe implements PipeTransform {

  constructor(
    private store: Store<AppState>,
  ) {}

  transform(permission: string): Observable<boolean> {
    return this.store.select(selectUserPermits).pipe(
      map(permissions => {
        if (!permissions || permissions.length === 0) {
          return false;
        }

        return permissions.some((permit) => permit.code === permission);
      })
    );
  }
}
