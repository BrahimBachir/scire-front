import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Routes } from '../common/config';
import { ICourseMetrics, ICourseProgress, IExamReadiness, IUserActivity } from '../common/models/interfaces';

@Injectable({
  providedIn: 'root',
})
export class BasicMetricsService {
  routes = Routes;

  constructor(private http: HttpClient) {}

  getOverviewMetrics(courseId: number): Observable<ICourseMetrics> {
    return this.http.get<ICourseMetrics>(
      environment.api_base_url + this.routes.api.learning.metrics.overview.replace(':courseId', courseId.toString()),
    );
  }

  getTopicsProgress(courseId: number): Observable<ICourseProgress> {
    return this.http.get<ICourseProgress>(
      environment.api_base_url + this.routes.api.learning.metrics.topics.replace(':courseId', courseId.toString()),
    );    
  }

  getReadiness(courseId: number): Observable<IExamReadiness[]> {
    return this.http.get<IExamReadiness[]>(
      environment.api_base_url + this.routes.api.learning.metrics.readiness.replace(':courseId', courseId.toString()),
    );
  }

  getCountdown(courseId: number): Observable<ICourseProgress> {
    return this.http.get<ICourseProgress>(
      environment.api_base_url + this.routes.api.learning.metrics.countdown.replace(':courseId', courseId.toString()),
    );
  }

  getActivity(courseId: number): Observable<IUserActivity> {
    return this.http.get<IUserActivity>(
      environment.api_base_url + this.routes.api.learning.metrics.activity.replace(':courseId', courseId.toString()),
    );
  }
}
