
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Routes } from '../common/config';
import { IDifficulty } from '../common/models/interfaces';


@Injectable({ providedIn: 'root' })
export class DifficultyService {
  routes = Routes;
  constructor(
    private http: HttpClient,
  ) {}

  public getDifficulties(): Observable<IDifficulty[]> {
    let URL = `${environment.api_base_url}${this.routes.api.learning.difficulties.base}`;
    return this.http.get<IDifficulty[]>(URL);
  }
}