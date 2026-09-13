import { CurrencyPipe } from '@angular/common';
import { Component, inject, OnInit, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ProductResponse } from '@core/models/product.model';
import { SaleResponse } from '@core/models/sale.model';
import { ProductApiService } from '@core/services/api/product-api.service';
import { SaleApiService } from '@core/services/api/sale-api.service';
import { AuthService } from '@core/services/auth/auth.service';
import { LoadingStateComponent } from '@shared/components/loading-state/loading-state.component';
import { PageHeaderComponent } from '@shared/components/page-header/page-header.component';
import { resolveErrorMessage } from '@core/utils/error-message.util';

@Component({
  selector: 'app-dashboard-page',
  standalone: true,
  imports: [PageHeaderComponent, LoadingStateComponent, RouterLink, CurrencyPipe],
  templateUrl: './dashboard-page.component.html',
  styleUrl: './dashboard-page.component.scss',
})
export class DashboardPageComponent implements OnInit {
  private readonly authService = inject(AuthService);
  private readonly productApiService = inject(ProductApiService);
  private readonly saleApiService = inject(SaleApiService);

  readonly currentUser = this.authService.currentUser;
  readonly isLoading = signal(true);
  readonly errorMessage = signal<string | null>(null);
  readonly products = signal<ProductResponse[]>([]);
  readonly sales = signal<SaleResponse[]>([]);

  ngOnInit(): void {
    this.loadDashboardData();
  }

  private loadDashboardData(): void {
    this.isLoading.set(true);
    this.errorMessage.set(null);

    let pendingRequests = 2;
    const finalize = (): void => {
      pendingRequests -= 1;
      if (pendingRequests === 0) {
        this.isLoading.set(false);
      }
    };

    this.productApiService.findAll().subscribe({
      next: (products) => this.products.set(products),
      error: (error: unknown) =>
        this.errorMessage.set(resolveErrorMessage(error, 'Falha ao carregar produtos')),
      complete: finalize,
    });

    this.saleApiService.findMine().subscribe({
      next: (sales) => this.sales.set(sales),
      error: (error: unknown) =>
        this.errorMessage.set(resolveErrorMessage(error, 'Falha ao carregar vendas')),
      complete: finalize,
    });
  }
}
