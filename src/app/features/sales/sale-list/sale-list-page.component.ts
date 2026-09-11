import { CurrencyPipe, DatePipe } from '@angular/common';
import { Component, inject, OnInit, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { SaleResponse } from '@core/models/sale.model';
import { SaleApiService } from '@core/services/api/sale-api.service';
import { resolveErrorMessage } from '@core/utils/error-message.util';
import { LoadingStateComponent } from '@shared/components/loading-state/loading-state.component';
import { PageHeaderComponent } from '@shared/components/page-header/page-header.component';

@Component({
  selector: 'app-sale-list-page',
  standalone: true,
  imports: [PageHeaderComponent, LoadingStateComponent, RouterLink, CurrencyPipe, DatePipe],
  templateUrl: './sale-list-page.component.html',
  styleUrl: './sale-list-page.component.scss',
})
export class SaleListPageComponent implements OnInit {
  private readonly saleApiService = inject(SaleApiService);

  readonly isLoading = signal(true);
  readonly sales = signal<SaleResponse[]>([]);
  readonly errorMessage = signal<string | null>(null);

  ngOnInit(): void {
    this.saleApiService.findMine().subscribe({
      next: (sales) => this.sales.set(sales),
      error: (error: unknown) => {
        this.errorMessage.set(resolveErrorMessage(error, 'Failed to load sales'));
        this.isLoading.set(false);
      },
      complete: () => this.isLoading.set(false),
    });
  }
}
