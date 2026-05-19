import { Routes } from '@angular/router';
import { MainLayoutComponent } from './shared/components/layout/main-layout.component';
import { authGuard } from './core/guards/auth.guard';
import { authRoutes } from './routes/auth.route';
import { dressesRoutes } from './routes/dresses.route';
import { inventoryRoutes } from './routes/inventory.route';
import { tenantsRoutes } from './routes/tenants.route';
import { usersRoutes } from './routes/users.route';

export const routes: Routes = [
  ...authRoutes,
  {
    path: '',
    component: MainLayoutComponent,
    canActivate: [authGuard],
    children: [
      {
        path: '',
        redirectTo: 'dresses',
        pathMatch: 'full',
      },
      ...dressesRoutes,
      ...inventoryRoutes,
      ...tenantsRoutes,
      ...usersRoutes,
      {
        path: '**',
        redirectTo: 'dresses',
      },
    ],
  },
];
