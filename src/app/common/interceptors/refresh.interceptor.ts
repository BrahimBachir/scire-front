import { inject } from '@angular/core';
import {
  HttpErrorResponse,
  HttpHandlerFn,
  HttpInterceptorFn,
  HttpRequest,
} from '@angular/common/http';
import { Store } from '@ngrx/store';
import { catchError, switchMap, throwError } from 'rxjs';
import { AppState } from '../store/app.store';
import { logoutAction } from '../store/actions';
import { RefreshCoordinatorService } from 'src/app/services/refresh-coordinator.service';

// Pre-login / session-management endpoints must never themselves trigger a refresh
// attempt - a 401 from any of these means "not logged in yet" or "refresh token
// itself is invalid", not "access token expired".
const EXCLUDED_PATH_FRAGMENTS = [
  'logins/refresh',
  'logins/logout',
  'logins/new',
  'logins/resend-code',
  'logins/validate-email',
];

function isExcludedFromRefresh(url: string): boolean {
  if (EXCLUDED_PATH_FRAGMENTS.some((fragment) => url.includes(fragment))) return true;
  // Bare POST /logins (password login) - excludes only the login call itself, not
  // the authenticated /logins/:id CRUD endpoints.
  return /\/logins\/?(\?.*)?$/.test(url);
}

export const refreshInterceptor: HttpInterceptorFn = (
  req: HttpRequest<unknown>,
  next: HttpHandlerFn,
) => {
  const coordinator = inject(RefreshCoordinatorService);
  const store = inject(Store<AppState>);

  return next(req).pipe(
    catchError((err: unknown) => {
      const isUnauthorized = err instanceof HttpErrorResponse && err.status === 401;

      if (!isUnauthorized || isExcludedFromRefresh(req.url)) {
        return throwError(() => err);
      }

      return coordinator.refreshAndSync().pipe(
        switchMap((newToken) =>
          next(req.clone({ setHeaders: { Authorization: `Bearer ${newToken}` } })),
        ),
        catchError((refreshErr) => {
          store.dispatch(logoutAction());
          return throwError(() => refreshErr);
        }),
      );
    }),
  );
};
