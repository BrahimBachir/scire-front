import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Routes } from '../common/config';
import { IModerationQueueItem, ModeratableFeatureType } from '../common/models/interfaces';

@Injectable({ providedIn: 'root' })
export class ModerationService {
  routes = Routes;
  constructor(private http: HttpClient) { }

  public getFeatureQueue(): Observable<IModerationQueueItem[]> {
    const URL = `${environment.api_base_url}${this.routes.api.moderation.features}`;
    return this.http.get<IModerationQueueItem[]>(URL);
  }

  public resolve(featureType: ModeratableFeatureType, id: number): Observable<{ message: string }> {
    const URL = `${environment.api_base_url}${this.routes.api.moderation.resolve}`
      .replace(':featureType', featureType)
      .replace(':id', id.toString());
    return this.http.post<{ message: string }>(URL, {});
  }

  public discard(featureType: ModeratableFeatureType, id: number): Observable<{ message: string }> {
    const URL = `${environment.api_base_url}${this.routes.api.moderation.discard}`
      .replace(':featureType', featureType)
      .replace(':id', id.toString());
    return this.http.post<{ message: string }>(URL, {});
  }

  public readReaction(reactionId: number): Observable<{ message: string }> {
    const URL = `${environment.api_base_url}${this.routes.api.moderation.readReaction}`
      .replace(':id', reactionId.toString());
    return this.http.post<{ message: string }>(URL, {});
  }
}
