import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { finalize, map, shareReplay, switchMap, tap } from 'rxjs/operators';
import { AppState } from '../common/store/app.store';
import { logedUserLoaded } from '../common/store/actions';
import { AuthService } from './auth.service';

// Collapses concurrent 401s (e.g. several API calls failing around the same moment
// the access token expires) into a single refresh + opos-api re-sync round trip,
// so we don't rotate the refresh token more than once per expiry.
@Injectable({ providedIn: 'root' })
export class RefreshCoordinatorService {
  private inFlight$: Observable<string> | null = null;

  constructor(
    private authService: AuthService,
    private store: Store<AppState>,
  ) {}

  refreshAndSync(): Observable<string> {
    if (!this.inFlight$) {
      this.inFlight$ = this.authService.refresh().pipe(
        switchMap(() => this.authService.getLogedUser()),
        tap((res: any) => this.store.dispatch(logedUserLoaded(res, res.token))),
        map((res: any) => res.token as string),
        finalize(() => {
          this.inFlight$ = null;
        }),
        shareReplay(1),
      );
    }
    return this.inFlight$;
  }
}
