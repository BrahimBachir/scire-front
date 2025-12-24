import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Routes } from '../common/config';
import { IStats } from '../common/models/interfaces';

@Injectable({
  providedIn: 'root',
})
export class StatsService {
      routes = Routes;
    
  constructor(private http: HttpClient) {}

  getDashboardStats(): Observable<IStats> {
    return this.http.get<IStats>(environment.api_base_url + this.routes.api.learning.stats.dashboard);
  }
}
