import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Routes } from '../common/config';
import { environment } from 'src/environments/environment';

export interface IVoucherEligibility {
  campaignOpen: boolean;
  alreadyRedeemed: boolean;
  pending?: { planCode: string; validTo: string } | null;
}

export interface IVoucherRedemption {
  planCode: string;
  grantedUntil: string;
}

@Injectable({ providedIn: 'root' })
export class VouchersService {
  routes = Routes;
  constructor(private http: HttpClient) {}

  public getEligibility(): Observable<IVoucherEligibility> {
    let URL = `${environment.api_base_url}${this.routes.api.vouchers.eligibility}`;
    return this.http.get<IVoucherEligibility>(URL);
  }

  public requestVoucher(planCode: string): Observable<{ validTo: string; warning?: string }> {
    let URL = `${environment.api_base_url}${this.routes.api.vouchers.request}`;
    return this.http.post<{ validTo: string; warning?: string }>(URL, { planCode });
  }

  public redeemVoucher(code: string): Observable<IVoucherRedemption> {
    let URL = `${environment.api_base_url}${this.routes.api.vouchers.redeem}`;
    return this.http.post<IVoucherRedemption>(URL, { code });
  }
}
