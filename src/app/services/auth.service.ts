import { Injectable } from '@angular/core';

import { HttpBackend, HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Routes } from '../common/config';
import { ILogin, IUser } from '../common/models/interfaces';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class AuthService {
      routes = Routes;
  // The mandatory-password-change token, held in memory only — never put in
  // NgRx state, which a meta-reducer mirrors wholesale into localStorage
  // (rehydrate.reducer.ts). This token must not persist across reloads or sit
  // in storage alongside the real session token.
  private changeToken: string | null = null;
  // A plain HttpClient built on HttpBackend bypasses HeadersInterceptor, which
  // otherwise overwrites the Authorization header with the normal stored
  // session token (or clobbers ours if one happens to be present) — this call
  // must use the change-token, and only the change-token.
  private readonly rawHttp: HttpClient;

  constructor(
    private http: HttpClient,
    httpBackend: HttpBackend,
  ) {
    this.rawHttp = new HttpClient(httpBackend);
  }

  public setChangeToken(token: string | null): void {
    this.changeToken = token;
  }

  public getChangeToken(): string | null {
    return this.changeToken;
  }

  public completeMandatoryPasswordChange(newPassword: string): Observable<{ message: string; token: string }> {
    let URL = `${environment.auth_base_url}${this.routes.auth.mandatory_password}`;
    return this.rawHttp.patch<{ message: string; token: string }>(
      URL,
      { newPassword },
      { headers: { Authorization: `Bearer ${this.changeToken}` }, withCredentials: true },
    );
  }

  public login(login: ILogin) {
    let URL = `${environment.auth_base_url}${this.routes.auth.logins}`
    return this.http.post(URL, {
      email: login.username,
      password: login.password,
    }, { withCredentials: true });
  }

  // Exchanges the httpOnly refresh-token cookie (set by opos-auth on login) for a
  // fresh opos-auth access token. Never sends a body - the cookie IS the credential.
  public refresh(): Observable<any> {
    let URL = `${environment.auth_base_url}${this.routes.auth.refresh}`
    return this.http.post(URL, {}, { withCredentials: true });
  }

  public logout(): Observable<any> {
    let URL = `${environment.auth_base_url}${this.routes.auth.logout}`
    return this.http.post(URL, {}, { withCredentials: true });
  }

  public getLogedUser() {
    let URL = `${environment.api_base_url}${this.routes.api.users.logged}`;
    return this.http.get(URL, {});
  }

  public createUserLogin(user: IUser, planCode?: string) {
    let URL = `${environment.api_base_url}${this.routes.api.users.new_login}`;
    return this.http.post(URL, { user, planCode });
  }

  public createLogin(login: ILogin): Observable<any>{
    let URL = `${environment.auth_base_url}${this.routes.auth.new}`
    return this.http.post(URL, {
      email: login.username,
      password: login.password,
    });
  }

  public resendCode(userCode: string): Observable<any>{
    let URL = `${environment.auth_base_url}${this.routes.auth.resend}`.replace(':userCode', userCode)
    
    return this.http.post(URL, {});
  }

  public validateCode(userCode: string, code: number): Observable<any>{
    let URL = `${environment.auth_base_url}${this.routes.auth.validate}`.replace(':userCode', userCode)
    return this.http.post(URL, {
      code
    }, { withCredentials: true });
  }
}