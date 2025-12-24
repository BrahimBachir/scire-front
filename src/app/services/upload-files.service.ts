import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { API_ROUTE_BASE_URL } from "../common/config/constants";

@Injectable({ providedIn: 'root' })
export class UsersService {
  constructor(
    private http: HttpClient,
    private defaultConfigService: DefaultConfigService
  ) {}

uploadImage(file: File) {
    const formData = new FormData();
    formData.append('file', file);
    let URL = `${this.defaultConfigService.getVariable(API_ROUTE_BASE_URL)}Documents/users`;
    
    return this.http.post(URL, formData);
  }
}