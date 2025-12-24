import { Injectable } from '@angular/core';

import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Routes } from '../common/config';
import { ILogin, IUser } from '../common/models/interfaces';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class AuthService {
      routes = Routes;
  constructor(
    private http: HttpClient,
  ) {}

  public login(login: ILogin) {
    let URL = `${environment.auth_base_url}${this.routes.auth.logins}`
    return this.http.post(URL, {
      email: login.username,
      password: login.password,
    });
  }

  public getLogedUser() {
    let URL = `${environment.api_base_url}${this.routes.api.users.logged}`;
    return this.http.get(URL, {});
  }

  public createUserLogin(user: IUser) {
    let URL = `${environment.api_base_url}${this.routes.api.users.new_login}`;
    return this.http.post(URL, {user});
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
    console.log("URL: ", URL);
    
    return this.http.post(URL, {});
  }

  public validateCode(userCode: string, code: number): Observable<any>{
    let URL = `${environment.auth_base_url}${this.routes.auth.validate}`.replace(':userCode', userCode)
    return this.http.post(URL, {
      code
    });
  }
}