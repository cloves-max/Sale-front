import { Routes } from '@angular/router';
import { SaleCreatePageComponent } from './sale-create/sale-create-page.component';
import { SaleDetailPageComponent } from './sale-detail/sale-detail-page.component';
import { SaleListPageComponent } from './sale-list/sale-list-page.component';

export const SALE_ROUTES: Routes = [
  {
    path: '',
    component: SaleListPageComponent,
  },
  {
    path: 'new',
    component: SaleCreatePageComponent,
  },
  {
    path: ':saleId',
    component: SaleDetailPageComponent,
  },
];
