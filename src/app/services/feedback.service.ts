import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Routes } from '../common/config';
import { IFeedback, IFeedbackSearchItem, IFeedbackType, IQueryingDto } from '../common/models/interfaces';
import { FeatureType } from '../common/models/interfaces/feature-types';
import { buildParams } from '../common/utils';

export interface IFeedbackPage {
  rows: IFeedback[];
  total: number;
}

@Injectable({ providedIn: 'root' })
export class FeedbackService {
  routes = Routes;
  constructor(private http: HttpClient) {}

  submit(
    featureId: number,
    featureType: FeatureType,
    feedbackTypeId: number,
    text: string,
    screenshots: File[],
  ): Observable<IFeedback> {
    const formData = new FormData();
    formData.append('featureId', String(featureId));
    formData.append('featureType', featureType);
    formData.append('feedbackTypeId', String(feedbackTypeId));
    formData.append('text', text);
    screenshots.forEach((file) => formData.append('screenshots', file));

    return this.http.post<IFeedback>(environment.api_base_url + this.routes.api.feedback.base, formData);
  }

  getTypes(): Observable<IFeedbackType[]> {
    return this.http.get<IFeedbackType[]>(environment.api_base_url + this.routes.api.feedback.types);
  }

  searchItems(featureType: FeatureType, term?: string): Observable<IFeedbackSearchItem[]> {
    let params = new HttpParams().set('featureType', featureType);
    if (term) params = params.set('term', term);
    return this.http.get<IFeedbackSearchItem[]>(environment.api_base_url + this.routes.api.feedback.searchable_items, {
      params,
    });
  }

  list(queryingDto?: IQueryingDto): Observable<IFeedbackPage> {
    let params = new HttpParams();
    if (queryingDto) params = buildParams(queryingDto, params);
    return this.http.get<IFeedbackPage>(environment.api_base_url + this.routes.api.feedback.base, { params });
  }

  // Attachments are SUPER-only and gated by the JWT interceptor, so they
  // can't be loaded via a plain <img src>: fetched as a blob and turned into
  // an object URL by the caller instead.
  downloadAttachment(attachmentId: number): Observable<Blob> {
    const URL =
      environment.api_base_url + this.routes.api.feedback.attachment.replace(':attachmentId', String(attachmentId));
    return this.http.get(URL, { responseType: 'blob' });
  }
}
