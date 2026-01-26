import { HttpClient, HttpParams } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { environment } from "src/environments/environment";
import { Routes } from "../common/config";
import { IQueryingDto, IReview, IReviewSummary } from "../common/models/interfaces";
import { buildParams } from "../common/utils";

@Injectable({ providedIn: 'root' })
export class ReviewsService {
    routes = Routes;
    constructor(private http: HttpClient) { }

    public createReview(reviewDto: IReview): Observable<IReview> {
        return this.http.post<IReview>(
            environment.api_base_url + this.routes.api.reviews.base, reviewDto
        );
    }

    /**
     * 
     * @param queryingDto 
     * @returns IReviewSummary
     */
    public getReviewSummary(queryingDto: IQueryingDto): Observable<IReviewSummary> {
        let params = new HttpParams();
        if (queryingDto)
            params = buildParams(queryingDto, params);
        return this.http.get<IReviewSummary>(
            environment.api_base_url + this.routes.api.reviews.summary, { params }
        )
    }

    public getLatestReviews(queryingDto: IQueryingDto): Observable<IReview[]> {
        let params = new HttpParams();
        if (queryingDto)
            params = buildParams(queryingDto, params);
        return this.http.get<IReview[]>(
            environment.api_base_url + this.routes.api.reviews.latests, { params }
        )
    }
}