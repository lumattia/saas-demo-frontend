import { Routes } from '@angular/router';
import { TenantListPageComponent } from '../features/tenants/pages/tenant-list/tenant-list-page.component';
import { TenantFormPageComponent } from '../features/tenants/pages/tenant-form/tenant-form-page.component';
import { authGuard } from '../core/guards/auth.guard';

export const tenantsRoutes: Routes = [
  {
    path: 'tenants', component: TenantListPageComponent,
    canActivate: [authGuard],
    children: [
      { path: 'new', component: TenantFormPageComponent },
      { path: ':id', component: TenantFormPageComponent }
    ]
  },
];
