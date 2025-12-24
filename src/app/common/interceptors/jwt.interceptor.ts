import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AppInitState, InitialAppState } from '../models/states';

@Injectable()
export class HeadersInterceptor implements HttpInterceptor {
  intercept(
    request: HttpRequest<unknown>,
    next: HttpHandler
  ): Observable<HttpEvent<unknown>> {
    let appStore: AppInitState = InitialAppState;
    const store = localStorage.getItem('state');
    if (store) appStore = JSON.parse(store);
    let jwtHeader = appStore.auth.token;
    if (jwtHeader) {
      return next.handle(
        request.clone({
          headers: request.headers.set('Authorization', `Bearer ${jwtHeader}`),
        })
      );
    }
    return next.handle(request);
  }
}


//export class JwtInterceptor implements HttpInterceptor {
/*   constructor(
    private authenticationService: AuthService,
    private authfackservice: AuthfakeauthenticationService
  ) {}

  intercept(
    request: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    if (environment.defaultauth === 'firebase') {
      // add authorization header with jwt token if available
      let currentUser = this.authenticationService.currentUser();
      if (currentUser && currentUser.token) {
        request = request.clone({
          setHeaders: {
            Authorization: `Bearer ${currentUser.token}`,
          },
        });
      }
    } else {
      // add authorization header with jwt token if available
      const currentUser = this.authfackservice.currentUserValue;
      if (currentUser && currentUser.token) {
        request = request.clone({
          setHeaders: {
            Authorization: `Bearer ${currentUser.token}`,
          },
        });
      }
    }
    return next.handle(request);
  }
}
 */