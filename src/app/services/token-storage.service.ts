import { Injectable } from '@angular/core';
import { AppInitState } from '../models/states';

@Injectable()
export class TokenStorageService {
  appStore!: AppInitState;

  constructor() {}

  public getToken() {
    this.getState();
    return this.appStore.auth.token;
  }

  private getState() {
    let store = localStorage.getItem('state');
    if (store) this.appStore = JSON.parse(store);
  }
}
