import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Routes } from '../common/config';
import { environment } from 'src/environments/environment';

@Injectable({ providedIn: 'root' })
export class PaymentsService {
  routes = Routes;
  constructor(private http: HttpClient) {}

  public createCheckoutSession(planCode: string, interval: 'month' | 'year'): Observable<{ url: string }> {
    let URL = `${environment.api_base_url}${this.routes.api.payments.checkout_session}`;
    return this.http.post<{ url: string }>(URL, { planCode, interval });
  }

  // Saves a card with no charge attempted (Stripe Checkout in setup mode) —
  // offered after a voucher redemption so billing can start automatically
  // once the free period ends.
  public createSetupSession(planCode: string): Observable<{ url: string }> {
    let URL = `${environment.api_base_url}${this.routes.api.payments.setup_session}`;
    return this.http.post<{ url: string }>(URL, { planCode });
  }

  // One-time payment for a single paid (TUT) course — redirects to Stripe
  // Checkout; enrollment happens server-side once payment is confirmed.
  public createCourseCheckoutSession(courseId: number): Observable<{ url: string }> {
    let URL = `${environment.api_base_url}${this.routes.api.payments.course_checkout_session}`;
    return this.http.post<{ url: string }>(URL, { courseId });
  }
}
