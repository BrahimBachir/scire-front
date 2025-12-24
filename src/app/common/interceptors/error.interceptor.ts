import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor, HttpErrorResponse, HttpResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { ERROR_401, ERROR, ERROR_402, ERROR_403, ERROR_404, ERROR_503, ERROR_500 } from '../config/constants';
import { ToastrService } from 'ngx-toastr';
import { logoutAction } from '../store/actions';
import { AppState } from '../store/app.store';



@Injectable()
export class ResponseInterceptor implements HttpInterceptor {
  constructor(
    private store: Store<AppState>,
    private readonly router: Router,
    public toastService: ToastrService,
  ) { }

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
            // Server-side error
            switch (error.status) {
              case 400:
                if (error.error.message.startsWith('ERROR_003')) {
                  this.store.dispatch(logoutAction());
                  this.router.navigate(['/auth/register'])
                }
                this.toastService.error(`${error.error.message}`, ERROR, {
                  timeOut: 3000,
                });
                break;
              case 401: //Unauthorized 
                if (error.error.message.startsWith('ERROR_012')) {
                  this.store.dispatch(logoutAction());
                }
                this.toastService.error(`${error.error.message}`, ERROR, {
                  timeOut: 3000,
                });
                break;
              case 402:
                this.toastService.error(`${error.error.message}`, ERROR, {
                  timeOut: 3000,
                });
                break;
              case 403: // Forbidden
                if (error.error.errorCode === 'ERROR_999') {
                //TODO: Display a dialog to the user so tehy can change their plan.
                  console.log("Error code sutebla e to user changing plan to Next Level: Silver or Gold!", error)
                } else {
                  this.toastService.error(`${error.error.message}`, ERROR, {
                    timeOut: 3000,
                  });
                }
                break;
              case 404: // Not found
                console.log(error)
                this.toastService.error(`${error.error.message}`, ERROR, {
                  timeOut: 3000,
                });
                break;
              case 503: // Server error
                this.toastService.error(`${error.error.message}`, ERROR, {
                  timeOut: 3000,
                });
                break;
              case 500: // Server error
                this.toastService.error(`${error.error.message}`, ERROR, {
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