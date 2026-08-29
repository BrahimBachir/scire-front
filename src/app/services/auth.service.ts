import { Injectable } from '@angular/core';

import { HttpBackend, HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Routes } from '../common/config';
import { ILogin, ISession, IUser } from '../common/models/interfaces';
import { Observable } from 'rxjs';
import { getOrCreateDeviceId } from '../common/utils';

@Injectable({ providedIn: 'root' })
export class AuthService {
      routes = Routes;
  // The mandatory-password-change token, held in memory only — never put in
  // NgRx state, which a meta-reducer mirrors wholesale into localStorage
  // (rehydrate.reducer.ts). This token must not persist across reloads or sit
  // in storage alongside the real session token.
  private changeToken: string | null = null;
  // Same in-memory-only rationale as changeToken — the short-lived
  // two-factor challenge token issued by login() when twoFactorRequired.
  private twoFactorToken: string | null = null;
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

  public setTwoFactorToken(token: string | null): void {
    this.twoFactorToken = token;
  }

  public getTwoFactorToken(): string | null {
    return this.twoFactorToken;
  }

  public completeMandatoryPasswordChange(newPassword: string): Observable<{ message: string; token: string }> {
    let URL = `${environment.auth_base_url}${this.routes.auth.mandatory_password}`;
    return this.rawHttp.patch<{ message: string; token: string }>(
      URL,
      { newPassword },
      { headers: { Authorization: `Bearer ${this.changeToken}` }, withCredentials: true },
    );
  }

  public forgotPassword(email: string): Observable<{ message: string }> {
    let URL = `${environment.auth_base_url}${this.routes.auth.forgot_password}`;
    return this.http.post<{ message: string }>(URL, { email });
  }

  // Same HttpBackend-bypass rationale as completeMandatoryPasswordChange: the
  // stored session token (if any) must not be sent here — only the reset
  // token carried in the emailed link, read by the caller from the URL.
  public resetPassword(resetToken: string, newPassword: string): Observable<{ message: string }> {
    let URL = `${environment.auth_base_url}${this.routes.auth.reset_password}`;
    return this.rawHttp.patch<{ message: string }>(
      URL,
      { newPassword },
      { headers: { Authorization: `Bearer ${resetToken}` } },
    );
  }

  // Logged-in self-service change — unlike resetPassword/completeMandatoryPasswordChange
  // this rides the caller's normal session token via HeadersInterceptor, not a
  // single-purpose token, so it uses the regular `http` client.
  public changePassword(currentPassword: string, newPassword: string): Observable<{ message: string }> {
    let URL = `${environment.auth_base_url}${this.routes.auth.change_password}`;
    return this.http.patch<{ message: string }>(URL, { currentPassword, newPassword });
  }

  public login(login: ILogin) {
    let URL = `${environment.auth_base_url}${this.routes.auth.logins}`
    return this.http.post(URL, {
      email: login.username,
      password: login.password,
    }, { withCredentials: true, headers: { 'X-Device-Id': getOrCreateDeviceId() } });
  }

  // Exchanges the httpOnly refresh-token cookie (set by opos-auth on login) for a
  // fresh opos-auth access token. Never sends a body - the cookie IS the credential.
  public refresh(): Observable<any> {
    let URL = `${environment.auth_base_url}${this.routes.auth.refresh}`
    return this.http.post(URL, {}, { withCredentials: true, headers: { 'X-Device-Id': getOrCreateDeviceId() } });
  }

  // Completes a 2FA challenge (login()'s twoFactorRequired branch) — same
  // HttpBackend-bypass rationale as completeMandatoryPasswordChange: only the
  // short-lived twoFactorToken must be sent, never the stored session token.
  public verifyTwoFactor(code: number): Observable<{ message: string; token: string }> {
    let URL = `${environment.auth_base_url}${this.routes.auth.two_factor_verify}`;
    return this.rawHttp.post<{ message: string; token: string }>(
      URL,
      { code, deviceId: getOrCreateDeviceId() },
      { headers: { Authorization: `Bearer ${this.twoFactorToken}` }, withCredentials: true },
    );
  }

  public resendTwoFactorCode(): Observable<void> {
    let URL = `${environment.auth_base_url}${this.routes.auth.two_factor_resend}`;
    return this.rawHttp.post<void>(URL, {}, { headers: { Authorization: `Bearer ${this.twoFactorToken}` } });
  }

  // Logged-in self-service toggle — rides the normal session token, like changePassword.
  public toggleTwoFactor(enabled: boolean): Observable<{ message: string }> {
    let URL = `${environment.auth_base_url}${this.routes.auth.two_factor_toggle}`;
    return this.http.patch<{ message: string }>(URL, { enabled });
  }

  public getMyLogin(): Observable<{ id: number; code: string; twoFactorEnabled: boolean }> {
    let URL = `${environment.auth_base_url}${this.routes.auth.me}`;
    return this.http.get<{ id: number; code: string; twoFactorEnabled: boolean }>(URL);
  }

  // withCredentials is required on all three: the backend reads the
  // httpOnly refresh_token cookie to resolve "which session is this one"
  // (isCurrent flag / revoke-others' exclusion) — without it, a cross-origin
  // request never carries the cookie at all.
  public getSessions(): Observable<ISession[]> {
    let URL = `${environment.auth_base_url}${this.routes.auth.sessions}`;
    return this.http.get<ISession[]>(URL, { withCredentials: true });
  }

  public revokeSession(familyId: string): Observable<void> {
    let URL = `${environment.auth_base_url}${this.routes.auth.session}`.replace(':familyId', familyId);
    return this.http.delete<void>(URL, { withCredentials: true });
  }

  public revokeOtherSessions(): Observable<{ revokedCount: number }> {
    let URL = `${environment.auth_base_url}${this.routes.auth.sessions_revoke_others}`;
    return this.http.post<{ revokedCount: number }>(URL, {}, { withCredentials: true });
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