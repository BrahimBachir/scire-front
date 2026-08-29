import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { Routes } from '../common/config';
import { ICourseStudySchedule } from '../common/models/interfaces';

@Injectable({ providedIn: 'root' })
export class StudyPlanService {
  routes = Routes;
  constructor(private http: HttpClient) {}

  public getSchedule(courseId: number): Observable<ICourseStudySchedule> {
    const URL = `${environment.api_base_url}${this.routes.api.learning.courses.study_plan}`.replace(
      ':id',
      courseId.toString()
    );
    // HttpClient doesn't deserialize JSON date strings into Date objects,
    // so examDate/event dates arrive as strings despite the response type.
    return this.http.get<ICourseStudySchedule>(URL).pipe(
      map((schedule) => ({
        ...schedule,
        examDate: schedule.examDate ? new Date(schedule.examDate) : null,
        events: (schedule.events || []).map((event) => ({
          ...event,
          date: new Date(event.date),
        })),
      }))
    );
  }
}
