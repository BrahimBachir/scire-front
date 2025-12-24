import { HttpClient, HttpParams } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { environment } from "src/environments/environment";
import { Routes } from "../common/config";
import { QueryingDto, IReaction, IFlashcard, IQuestion, IRule, IScheme, IUser, ReactionResponse } from "../common/models/interfaces";
import { buildParams } from "../common/utils";

@Injectable({ providedIn: 'root' })
export class ReactionsService {
    routes = Routes;
    constructor(private http: HttpClient) { }

    /**
     * 
     * @param content 
     * @param queryingDto 
     * @param feedback 
     * @returns 
     */
    public processReaction(
        content: IScheme | IRule | IFlashcard | IQuestion,
        queryingDto?: QueryingDto,
        feedback?: string
    ): Observable<IReaction> {
        console.log("DTO querying: ", queryingDto)
        let params = new HttpParams();
        if (queryingDto)
            params = buildParams(queryingDto, params);
        return this.http.post<IReaction>(
            environment.api_base_url + this.routes.api.reactions.base, { content, feedback }, { params }
        );
    }

    /**
     * 
     * @param queryingDto: featureId && feature (type)
     * @returns string: the user's vote on the feature 
     */
    public getMyVote(
        queryingDto?: QueryingDto,
    ): Observable<ReactionResponse> {
        console.log("DTO querying: ", queryingDto)
        let params = new HttpParams();
        if (queryingDto)
            params = buildParams(queryingDto, params);
        return this.http.get<ReactionResponse>(
             environment.api_base_url + this.routes.api.reactions.feature_vote, {params}
        )
    }

    /**
     * 
     * @param queryingDto: featureId && feature (type)
     * @returns likeCount (number) && dislikeCount (number)
     */
    public getVoteState(
        queryingDto?: QueryingDto,
    ): Observable<ReactionResponse> {
        console.log("DTO querying: ", queryingDto)
        let params = new HttpParams();
        if (queryingDto)
            params = buildParams(queryingDto, params);
        return this.http.get<ReactionResponse>(
             environment.api_base_url + this.routes.api.reactions.vote_state, {params}
        )
    }
}