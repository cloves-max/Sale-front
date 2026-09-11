import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable, map } from 'rxjs';
import { API_ENDPOINTS } from '@core/constants/api-endpoints.constant';
import { ApiResponse } from '@core/models/api-response.model';
import { CreateSaleRequest, SaleResponse } from '@core/models/sale.model';
import { environment } from '@env/environment';

@Injectable({ providedIn: 'root' })
export class SaleApiService {
  private readonly httpClient = inject(HttpClient);
  private readonly apiBaseUrl = environment.apiBaseUrl;

  create(payload: CreateSaleRequest): Observable<SaleResponse> {
    return this.httpClient
      .post<ApiResponse<SaleResponse>>(`${this.apiBaseUrl}${API_ENDPOINTS.sales.root}`, payload)
      .pipe(map((response) => this.unwrap(response)));
  }

  findById(saleId: number): Observable<SaleResponse> {
    return this.httpClient
      .get<ApiResponse<SaleResponse>>(`${this.apiBaseUrl}${API_ENDPOINTS.sales.byId(saleId)}`)
      .pipe(map((response) => this.unwrap(response)));
  }

  findMine(): Observable<SaleResponse[]> {
    return this.httpClient
      .get<ApiResponse<SaleResponse[]>>(`${this.apiBaseUrl}${API_ENDPOINTS.sales.me}`)
      .pipe(map((response) => this.unwrap(response)));
  }

  private unwrap<T>(response: ApiResponse<T>): T {
    if (!response.success || response.data === null) {
      throw new Error(response.message || 'Sale request failed');
    }
    return response.data;
  }
}
