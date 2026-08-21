import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor, HttpErrorResponse, HttpResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { ERROR_401, ERROR, ERROR_402, ERROR_403, ERROR_404, ERROR_503, ERROR_500 } from '../config/constants';
import { ToastrService } from 'ngx-toastr';
import { TranslateService } from '@ngx-translate/core';
import { logoutAction } from '../store/actions';
import { AppState } from '../store/app.store';



@Injectable()
export class ResponseInterceptor implements HttpInterceptor {
  constructor(
    private store: Store<AppState>,
    private readonly router: Router,
    public toaster: ToastrService,
    private readonly translate: TranslateService,
  ) { }

  // Backend error messages are i18n keys (e.g. 'ERRORS.NOT_FOUND.COURSES'). ngx-translate's
  // instant() returns the key itself when no translation exists, so fall back to a generic
  // message rather than showing a raw dotted key to the user.
  private translateErrorMessage(message: string | undefined): string {
    if (!message) return this.translate.instant('ERRORS.INTERNAL.UNKNOWN');
    const translated = this.translate.instant(message);
    return translated === message ? this.translate.instant('ERRORS.INTERNAL.UNKNOWN') : translated;
  }

  intercept(
    request: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    return next.handle(request).pipe(
      catchError((error) => {
        if (error instanceof HttpErrorResponse) {
          if (error.error instanceof ErrorEvent) {
            // Client-side error
          } else {
            console.log(error.error)
            // Server-side error
            switch (error.status) {
              case 400:
                if (error.error.message === 'ERRORS.VALIDATION.EMAIL') {
                  this.store.dispatch(logoutAction());
                  //this.router.navigate(['/auth/register'])
                }
                this.toaster.error(this.translateErrorMessage(error.error.message), ERROR, {
                  timeOut: 3000,
                });
                break;
              case 401: //Unauthorized
                // refreshInterceptor now owns 401 handling (retry-with-refreshed-token,
                // then logout only if the refresh itself fails) - don't dispatch logout
                // here too, or a request mid-refresh would get logged out prematurely.
                this.toaster.error(this.translateErrorMessage(error.error.message), ERROR, {
                  timeOut: 3000,
                });
                break;
              case 402:
                this.toaster.error(this.translateErrorMessage(error.error.message), ERROR, {
                  timeOut: 3000,
                });
                break;
              case 403: // Forbidden
                if (error.error.errorCode === 'ERRORS.FORBIDDEN.PLANS') {
                //TODO: Display a dialog to the user so tehy can change their plan.
                  console.log("Error code sutebla e to user changing plan to Next Level: Silver or Gold!", error)
                } else {
                  this.toaster.error(this.translateErrorMessage(error.error.message), ERROR, {
                    timeOut: 3000,
                  });
                }
                break;
              case 404: // Not found
                if (!['ERROR_999', 'ERROR_650'].includes(error.error.errorCode))
                //if(error.error.message !== "ERROR_666")
                this.toaster.error(this.translateErrorMessage(error.error.message), ERROR, {
                  timeOut: 3000,
                });
                break;
              case 503: // Server error
                this.toaster.error(this.translateErrorMessage(error.error.message), ERROR, {
                  timeOut: 3000,
                });
                break;
              case 500: // Server error
                this.toaster.error(this.translateErrorMessage(error.error.message), ERROR, {
                  timeOut: 3000,
                });
                break;
              default:
                console.error("The unknown error", error.error)
            }
          }
        }
        return throwError(() => error);
      })
    );
  }
}