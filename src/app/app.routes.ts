import { Routes } from '@angular/router';
import { authGuard } from '@core/guards/auth.guard';
import { ShellComponent } from '@layout/shell/shell.component';

export const routes: Routes = [
  {
    path: 'auth',
    loadChildren: () => import('@features/auth/auth.routes').then((module) => module.AUTH_ROUTES),
  },
  {
    path: '',
    component: ShellComponent,
    canActivate: [authGuard],
    children: [
      {
        path: 'dashboard',
        loadComponent: () =>
          import('@features/dashboard/dashboard-page.component').then(
            (module) => module.DashboardPageComponent,
          ),
      },
      {
        path: 'products',
        loadChildren: () =>
          import('@features/products/products.routes').then((module) => module.PRODUCT_ROUTES),
      },
      {
        path: 'sales',
        loadChildren: () =>
          import('@features/sales/sales.routes').then((module) => module.SALE_ROUTES),
      },
      {
        path: '',
        pathMatch: 'full',
        redirectTo: 'dashboard',
      },
    ],
  },
  {
    path: '**',
    redirectTo: 'dashboard',
  },
];
