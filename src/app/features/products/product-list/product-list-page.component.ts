import { CurrencyPipe } from '@angular/common';
import { Component, inject, OnInit, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ProductResponse } from '@core/models/product.model';
import { ProductApiService } from '@core/services/api/product-api.service';
import { NotificationService } from '@core/services/notification/notification.service';
import { resolveErrorMessage } from '@core/utils/error-message.util';
import { LoadingStateComponent } from '@shared/components/loading-state/loading-state.component';
import { PageHeaderComponent } from '@shared/components/page-header/page-header.component';

@Component({
  selector: 'app-product-list-page',
  standalone: true,
  imports: [PageHeaderComponent, LoadingStateComponent, RouterLink, CurrencyPipe],
  templateUrl: './product-list-page.component.html',
  styleUrl: './product-list-page.component.scss',
})
export class ProductListPageComponent implements OnInit {
  private readonly productApiService = inject(ProductApiService);
  private readonly notificationService = inject(NotificationService);

  readonly isLoading = signal(true);
  readonly products = signal<ProductResponse[]>([]);
  readonly errorMessage = signal<string | null>(null);

  ngOnInit(): void {
    this.loadProducts();
  }

  loadProducts(): void {
    this.isLoading.set(true);
    this.errorMessage.set(null);

    this.productApiService.findAll().subscribe({
      next: (products) => this.products.set(products),
      error: (error: unknown) => {
        this.errorMessage.set(resolveErrorMessage(error, 'Failed to load products'));
        this.isLoading.set(false);
      },
      complete: () => this.isLoading.set(false),
    });
  }

  deleteProduct(product: ProductResponse): void {
    const confirmed = window.confirm(`Soft-delete product "${product.name}"?`);
    if (!confirmed) {
      return;
    }

    this.productApiService.delete(product.id).subscribe({
      next: () => {
        this.notificationService.success('Product deleted successfully');
        this.loadProducts();
      },
      error: (error: unknown) => {
        this.notificationService.error(resolveErrorMessage(error, 'Failed to delete product'));
      },
    });
  }
}
