import { Component, inject, OnInit, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { ProductApiService } from '@core/services/api/product-api.service';
import { NotificationService } from '@core/services/notification/notification.service';
import { resolveErrorMessage } from '@core/utils/error-message.util';
import { LoadingStateComponent } from '@shared/components/loading-state/loading-state.component';
import { PageHeaderComponent } from '@shared/components/page-header/page-header.component';

@Component({
  selector: 'app-product-form-page',
  standalone: true,
  imports: [PageHeaderComponent, LoadingStateComponent, ReactiveFormsModule, RouterLink],
  templateUrl: './product-form-page.component.html',
  styleUrl: './product-form-page.component.scss',
})
export class ProductFormPageComponent implements OnInit {
  private readonly formBuilder = inject(FormBuilder);
  private readonly productApiService = inject(ProductApiService);
  private readonly notificationService = inject(NotificationService);
  private readonly activatedRoute = inject(ActivatedRoute);
  private readonly router = inject(Router);

  readonly isLoading = signal(false);
  readonly isSubmitting = signal(false);
  readonly formError = signal<string | null>(null);
  readonly productId = signal<number | null>(null);

  readonly productForm = this.formBuilder.nonNullable.group({
    name: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(150)]],
    description: [''],
    price: [0.01, [Validators.required, Validators.min(0.01)]],
    stockQuantity: [0, [Validators.required, Validators.min(0)]],
  });

  get isEditMode(): boolean {
    return this.productId() !== null;
  }

  ngOnInit(): void {
    const routeProductId = this.activatedRoute.snapshot.paramMap.get('productId');
    if (!routeProductId) {
      return;
    }

    const parsedProductId = Number(routeProductId);
    if (Number.isNaN(parsedProductId)) {
      this.formError.set('Identificador de produto inválido');
      return;
    }

    this.productId.set(parsedProductId);
    this.loadProduct(parsedProductId);
  }

  submit(): void {
    this.formError.set(null);

    if (this.productForm.invalid) {
      this.productForm.markAllAsTouched();
      return;
    }

    const payload = {
      ...this.productForm.getRawValue(),
      description: this.productForm.controls.description.value.trim() || null,
    };

    this.isSubmitting.set(true);

    const request$ = this.isEditMode
      ? this.productApiService.update(this.productId()!, payload)
      : this.productApiService.create(payload);

    request$.subscribe({
      next: () => {
        this.notificationService.success(
          this.isEditMode ? 'Produto atualizado com sucesso' : 'Produto criado com sucesso',
        );
        void this.router.navigate(['/products']);
      },
      error: (error: unknown) => {
        this.formError.set(resolveErrorMessage(error, 'Falha ao salvar produto'));
        this.isSubmitting.set(false);
      },
      complete: () => this.isSubmitting.set(false),
    });
  }

  private loadProduct(productId: number): void {
    this.isLoading.set(true);

    this.productApiService.findById(productId).subscribe({
      next: (product) => {
        this.productForm.patchValue({
          name: product.name,
          description: product.description ?? '',
          price: product.price,
          stockQuantity: product.stockQuantity,
        });
      },
      error: (error: unknown) => {
        this.formError.set(resolveErrorMessage(error, 'Falha ao carregar produto'));
        this.isLoading.set(false);
      },
      complete: () => this.isLoading.set(false),
    });
  }
}
