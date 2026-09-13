import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable, map } from 'rxjs';
import { API_ENDPOINTS } from '@core/constants/api-endpoints.constant';
import { ApiResponse } from '@core/models/api-response.model';
import { ProductRequest, ProductResponse } from '@core/models/product.model';
import { environment } from '@env/environment';

@Injectable({ providedIn: 'root' })
export class ProductApiService {
  private readonly httpClient = inject(HttpClient);
  private readonly apiBaseUrl = environment.apiBaseUrl;

  findAll(): Observable<ProductResponse[]> {
    return this.httpClient
      .get<ApiResponse<ProductResponse[]>>(`${this.apiBaseUrl}${API_ENDPOINTS.products.root}`)
      .pipe(map((response) => this.unwrap(response)));
  }

  findById(productId: number): Observable<ProductResponse> {
    return this.httpClient
      .get<ApiResponse<ProductResponse>>(`${this.apiBaseUrl}${API_ENDPOINTS.products.byId(productId)}`)
      .pipe(map((response) => this.unwrap(response)));
  }

  create(payload: ProductRequest): Observable<ProductResponse> {
    return this.httpClient
      .post<ApiResponse<ProductResponse>>(`${this.apiBaseUrl}${API_ENDPOINTS.products.root}`, payload)
      .pipe(map((response) => this.unwrap(response)));
  }

  update(productId: number, payload: ProductRequest): Observable<ProductResponse> {
    return this.httpClient
      .put<ApiResponse<ProductResponse>>(
        `${this.apiBaseUrl}${API_ENDPOINTS.products.byId(productId)}`,
        payload,
      )
      .pipe(map((response) => this.unwrap(response)));
  }

  delete(productId: number): Observable<void> {
    return this.httpClient.delete<void>(`${this.apiBaseUrl}${API_ENDPOINTS.products.byId(productId)}`);
  }

  private unwrap<T>(response: ApiResponse<T>): T {
    if (!response.success || response.data === null) {
      throw new Error(response.message || 'Falha na requisição de produto');
    }
    return response.data;
  }
}
