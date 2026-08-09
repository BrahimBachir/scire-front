import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Routes } from '../common/config';
import { IEpic } from '../common/models/interfaces';

@Injectable({ providedIn: 'root' })
export class KanbanService {
  routes = Routes;
  constructor(private http: HttpClient) {}

  public getData(courseId: number): Observable<IEpic[]> {

    return this.http.get<IEpic[]>(
      environment.api_base_url +
        this.routes.api.learning.tasks.replace(
          ':courseId',
          courseId.toString(),
        ),
    );
  }
}