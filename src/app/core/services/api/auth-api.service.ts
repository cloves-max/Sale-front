import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable, map } from 'rxjs';
import { API_ENDPOINTS } from '@core/constants/api-endpoints.constant';
import { ApiResponse } from '@core/models/api-response.model';
import { AuthResponse, LoginRequest, RegisterRequest } from '@core/models/auth.model';
import { environment } from '@env/environment';

@Injectable({ providedIn: 'root' })
export class AuthApiService {
  private readonly httpClient = inject(HttpClient);
  private readonly apiBaseUrl = environment.apiBaseUrl;

  login(credentials: LoginRequest): Observable<AuthResponse> {
    return this.httpClient
      .post<ApiResponse<AuthResponse>>(`${this.apiBaseUrl}${API_ENDPOINTS.auth.login}`, credentials)
      .pipe(map((response) => this.unwrap(response)));
  }

  register(payload: RegisterRequest): Observable<AuthResponse> {
    return this.httpClient
      .post<ApiResponse<AuthResponse>>(`${this.apiBaseUrl}${API_ENDPOINTS.auth.register}`, payload)
      .pipe(map((response) => this.unwrap(response)));
  }

  private unwrap(response: ApiResponse<AuthResponse>): AuthResponse {
    if (!response.success || !response.data) {
      throw new Error(response.message || 'Authentication request failed');
    }
    return response.data;
  }
}
