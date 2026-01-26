

import {  Pipe, PipeTransform } from '@angular/core';
import { Store } from '@ngrx/store';
import { AppState } from '../store/app.store';
import { selectLogedUser } from '../store/selectors';
import { map, Observable } from 'rxjs';

@Pipe({ name: 'myOwnElement' })
export class MyOwnElementPipe implements PipeTransform {

  constructor(
    private store: Store<AppState>,
  ) {}

  transform(creatorId: number): Observable<boolean> {
    return this.store.select(selectLogedUser)
    .pipe(
      map((user) => {
        return creatorId === user.id;
      })
    );
  }
}
