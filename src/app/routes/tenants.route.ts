import { Routes } from '@angular/router';
import { TenantsPageComponent } from '../features/tenants/tenants-page.component';
import { TenantListPageComponent } from '../features/tenants/pages/tenant-list/tenant-list-page.component';
import { TenantFormPageComponent } from '../features/tenants/pages/tenant-form/tenant-form-page.component';
import { authGuard } from '../core/guards/auth.guard';
import { roleGuard } from '../core/guards/role.guard';
import { UnsavedChangesGuard } from '../core/guards/unsaved-changes.guard';

export const tenantsRoutes: Routes = [
  {
    path: 'tenants',
    component: TenantsPageComponent,
    canActivate: [authGuard, roleGuard],
    data: { requiredRole: 'RESELLER' },
    children: [
      { path: '', component: TenantListPageComponent },
      { path: 'new', component: TenantFormPageComponent, canDeactivate: [UnsavedChangesGuard] },
      { path: ':id', component: TenantFormPageComponent, canDeactivate: [UnsavedChangesGuard] }
    ]
  }
];
