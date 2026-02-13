import { HttpClient, HttpParams } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { environment } from "src/environments/environment";
import { Routes } from "../common/config";
import { IQueryingDto, IComment, IIncomingEntity, } from "../common/models/interfaces";
import { buildParams } from "../common/utils";

@Injectable({ providedIn: 'root' })
export class CommentsService {
    routes = Routes;
    constructor(private http: HttpClient) { }

    public create(commentDto: IComment): Observable<IComment> {
        return this.http.post<IComment>(
            environment.api_base_url + this.routes.api.comments.base, commentDto
        );
    }

    /**
     * 
     * @param queryingDto 
     * @returns IIncomingEntity
     */
    public getAll(queryingDto: IQueryingDto): Observable<IIncomingEntity> {
        let params = new HttpParams();
        if (queryingDto)
            params = buildParams(queryingDto, params);
        return this.http.get<IIncomingEntity>(
            environment.api_base_url + this.routes.api.comments.base, { params }
        )
    }

    public getOne(id: number): Observable<IComment> {
        return this.http.get<IComment>(
            `${environment.api_base_url}${this.routes.api.comments.base}/${id}`
        )
    }
}