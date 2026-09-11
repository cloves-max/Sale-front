import { Routes } from '@angular/router';
import { ProductFormPageComponent } from './product-form/product-form-page.component';
import { ProductListPageComponent } from './product-list/product-list-page.component';

export const PRODUCT_ROUTES: Routes = [
  {
    path: '',
    component: ProductListPageComponent,
  },
  {
    path: 'new',
    component: ProductFormPageComponent,
  },
  {
    path: ':productId/edit',
    component: ProductFormPageComponent,
  },
];
