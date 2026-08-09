import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Routes } from '../common/config';
import {
  IActivityTrend,
  IPassProbability,
  ISkillsRadar,
  IStudyPlanItem,
  ITopicPerformance,
  IWeakSpots,
} from '../common/models/interfaces';

@Injectable({
  providedIn: 'root',
})
export class AdvancedMetricsService {
  routes = Routes;

  constructor(private http: HttpClient) {}

  getActivityTrend(courseId: number): Observable<IActivityTrend> {
    return this.http.get<IActivityTrend>(
      environment.api_base_url + this.routes.api.learning.advancedMetrics.activityTrend.replace(':courseId', courseId.toString()),
    );
  }

  getTopicPerformance(courseId: number): Observable<ITopicPerformance[]> {
    return this.http.get<ITopicPerformance[]>(
      environment.api_base_url + this.routes.api.learning.advancedMetrics.topicPerformance.replace(':courseId', courseId.toString()),
    );
  }

  getWeakSpots(courseId: number): Observable<IWeakSpots> {
    return this.http.get<IWeakSpots>(
      environment.api_base_url + this.routes.api.learning.advancedMetrics.weakSpots.replace(':courseId', courseId.toString()),
    );
  }

  getSkillsRadar(courseId: number): Observable<ISkillsRadar> {
    return this.http.get<ISkillsRadar>(
      environment.api_base_url + this.routes.api.learning.advancedMetrics.skillsRadar.replace(':courseId', courseId.toString()),
    );
  }

  getPassProbability(courseId: number): Observable<IPassProbability> {
    return this.http.get<IPassProbability>(
      environment.api_base_url + this.routes.api.learning.advancedMetrics.passProbability.replace(':courseId', courseId.toString()),
    );
  }

  getStudyPlan(courseId: number): Observable<IStudyPlanItem[]> {
    return this.http.get<IStudyPlanItem[]>(
      environment.api_base_url + this.routes.api.learning.advancedMetrics.studyPlan.replace(':courseId', courseId.toString()),
    );
  }
}
