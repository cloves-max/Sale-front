import { CurrencyPipe } from '@angular/common';
import { Component, inject, OnInit, signal } from '@angular/core';
import { FormArray, FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { ProductResponse } from '@core/models/product.model';
import { ProductApiService } from '@core/services/api/product-api.service';
import { SaleApiService } from '@core/services/api/sale-api.service';
import { NotificationService } from '@core/services/notification/notification.service';
import { resolveErrorMessage } from '@core/utils/error-message.util';
import { LoadingStateComponent } from '@shared/components/loading-state/loading-state.component';
import { PageHeaderComponent } from '@shared/components/page-header/page-header.component';

@Component({
  selector: 'app-sale-create-page',
  standalone: true,
  imports: [
    PageHeaderComponent,
    LoadingStateComponent,
    ReactiveFormsModule,
    RouterLink,
    CurrencyPipe,
  ],
  templateUrl: './sale-create-page.component.html',
  styleUrl: './sale-create-page.component.scss',
})
export class SaleCreatePageComponent implements OnInit {
  private readonly formBuilder = inject(FormBuilder);
  private readonly productApiService = inject(ProductApiService);
  private readonly saleApiService = inject(SaleApiService);
  private readonly notificationService = inject(NotificationService);
  private readonly router = inject(Router);

  readonly isLoading = signal(true);
  readonly isSubmitting = signal(false);
  readonly formError = signal<string | null>(null);
  readonly products = signal<ProductResponse[]>([]);

  readonly saleForm = this.formBuilder.nonNullable.group({
    items: this.formBuilder.array([this.createItemGroup()]),
  });

  get itemsFormArray(): FormArray {
    return this.saleForm.controls.items;
  }

  ngOnInit(): void {
    this.productApiService.findAll().subscribe({
      next: (products) => this.products.set(products),
      error: (error: unknown) => {
        this.formError.set(resolveErrorMessage(error, 'Failed to load products'));
        this.isLoading.set(false);
      },
      complete: () => this.isLoading.set(false),
    });
  }

  addItem(): void {
    this.itemsFormArray.push(this.createItemGroup());
  }

  removeItem(index: number): void {
    if (this.itemsFormArray.length === 1) {
      return;
    }
    this.itemsFormArray.removeAt(index);
  }

  submit(): void {
    this.formError.set(null);

    if (this.saleForm.invalid) {
      this.saleForm.markAllAsTouched();
      return;
    }

    this.isSubmitting.set(true);

    const payload = {
      items: this.saleForm.getRawValue().items.map((item) => ({
        productId: Number(item.productId),
        quantity: Number(item.quantity),
      })),
    };

    this.saleApiService.create(payload).subscribe({
      next: (sale) => {
        this.notificationService.success('Sale created successfully');
        void this.router.navigate(['/sales', sale.id]);
      },
      error: (error: unknown) => {
        this.formError.set(resolveErrorMessage(error, 'Failed to create sale'));
        this.isSubmitting.set(false);
      },
      complete: () => this.isSubmitting.set(false),
    });
  }

  private createItemGroup() {
    return this.formBuilder.nonNullable.group({
      productId: [0, [Validators.required, Validators.min(1)]],
      quantity: [1, [Validators.required, Validators.min(1)]],
    });
  }
}
