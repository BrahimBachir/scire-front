import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Routes } from '../common/config';
import { IAnnouncement } from '../common/models/interfaces';

@Injectable({ providedIn: 'root' })
export class AnnouncementsService {
  routes = Routes;
  constructor(private http: HttpClient) {}

  public getAll(courseId: number): Observable<IAnnouncement[]> {
    return this.http.get<IAnnouncement[]>(
      environment.api_base_url + 
      this.routes.api.learning.announcements.by_course.replace(':courseId', courseId.toString())
    );
  }

  public getOne(id: number): Observable<IAnnouncement> {
    return this.http.get<IAnnouncement>(
      `${environment.api_base_url}${this.routes.api.learning.announcements.base}/${id}`
    );
  }

  public create(announcement: IAnnouncement): Observable<IAnnouncement> {
    return this.http.post<IAnnouncement>(environment.api_base_url + this.routes.api.learning.announcements.base, announcement)
  }


  public increaseViews(id: number): Observable<IAnnouncement> {
    return this.http.post<IAnnouncement>(`${environment.api_base_url}${this.routes.api.learning.announcements.views.replace(':id', id.toString())}`, {})
  }

  public update(id: number, announcement: IAnnouncement): Observable<IAnnouncement> {
    return this.http.patch<IAnnouncement>(`${environment.api_base_url + this.routes.api.learning.announcements.base}/${id}`, announcement)
  }

  public delete(id: number){
    return this.http.delete(`${environment.api_base_url + this.routes.api.learning.announcements.base}/${id}`)
  }
}
