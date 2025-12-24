import { HttpClient, HttpParams } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { environment } from "src/environments/environment";
import { Routes } from "../common/config";
import { QueryingDto, IReview, IReviewSummary } from "../common/models/interfaces";
import { buildParams } from "../common/utils";

@Injectable({ providedIn: 'root' })
export class ReviewsService {
    routes = Routes;
    constructor(private http: HttpClient) { }

    public createReview(reviewDto: IReview): Observable<IReview> {
        console.log(reviewDto)
        return this.http.post<IReview>(
            environment.api_base_url + this.routes.api.reviews.base, reviewDto
        );
    }

    /**
     * 
     * @param queryingDto 
     * @returns IReviewSummary
     */
    public getReviewSummary(queryingDto: QueryingDto): Observable<IReviewSummary> {
        let params = new HttpParams();
        if (queryingDto)
            params = buildParams(queryingDto, params);
        return this.http.get<IReviewSummary>(
            environment.api_base_url + this.routes.api.reviews.summary, { params }
        )
    }

    public getLatestReviews(queryingDto: QueryingDto): Observable<IReview[]> {
        let params = new HttpParams();
        if (queryingDto)
            params = buildParams(queryingDto, params);
        return this.http.get<IReview[]>(
            environment.api_base_url + this.routes.api.reviews.latests, { params }
        )
    }
}