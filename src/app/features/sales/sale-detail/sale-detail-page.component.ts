import { CurrencyPipe, DatePipe } from '@angular/common';
import { Component, inject, OnInit, signal } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { SaleResponse } from '@core/models/sale.model';
import { SaleApiService } from '@core/services/api/sale-api.service';
import { resolveErrorMessage } from '@core/utils/error-message.util';
import { LoadingStateComponent } from '@shared/components/loading-state/loading-state.component';
import { PageHeaderComponent } from '@shared/components/page-header/page-header.component';

@Component({
  selector: 'app-sale-detail-page',
  standalone: true,
  imports: [PageHeaderComponent, LoadingStateComponent, RouterLink, CurrencyPipe, DatePipe],
  templateUrl: './sale-detail-page.component.html',
  styleUrl: './sale-detail-page.component.scss',
})
export class SaleDetailPageComponent implements OnInit {
  private readonly saleApiService = inject(SaleApiService);
  private readonly activatedRoute = inject(ActivatedRoute);

  readonly isLoading = signal(true);
  readonly errorMessage = signal<string | null>(null);
  readonly sale = signal<SaleResponse | null>(null);

  ngOnInit(): void {
    const saleIdParam = this.activatedRoute.snapshot.paramMap.get('saleId');
    const saleId = Number(saleIdParam);

    if (!saleIdParam || Number.isNaN(saleId)) {
      this.errorMessage.set('Identificador de venda inválido');
      this.isLoading.set(false);
      return;
    }

    this.saleApiService.findById(saleId).subscribe({
      next: (sale) => this.sale.set(sale),
      error: (error: unknown) => {
        this.errorMessage.set(resolveErrorMessage(error, 'Falha ao carregar venda'));
        this.isLoading.set(false);
      },
      complete: () => this.isLoading.set(false),
    });
  }
}
