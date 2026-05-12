import { Routes } from '@angular/router';
import { MainLayoutComponent } from './shared/components/layout/main-layout.component';
import { DressListPageComponent } from './features/dresses/pages/dress-list/dress-list-page.component';
import { DressFormPageComponent } from './features/dresses/pages/dress-form/dress-form-page.component';
import { InventoryListPageComponent } from './features/inventory/pages/inventory-list/inventory-list-page.component';
import { InventoryFormPageComponent } from './features/inventory/pages/inventory-form/inventory-form-page.component';
import { moduleGuard } from './core/guards/module.guard';

export const routes: Routes = [
  {
    path: '',
    component: MainLayoutComponent,
    children: [
      {
        path: 'dresses',
        component: DressListPageComponent,
        canActivate: [moduleGuard],
        data: { module: 'DRESS' }
      },
      {
        path: 'dresses/:id',
        component: DressFormPageComponent,
        canActivate: [moduleGuard],
        data: { module: 'DRESS' }
      },
      {
        path: 'inventory',
        component: InventoryListPageComponent,
        canActivate: [moduleGuard],
        data: { module: 'INVENTORY' }
      },
      {
        path: 'inventory/:id',
        component: InventoryFormPageComponent,
        canActivate: [moduleGuard],
        data: { module: 'INVENTORY' }
      },
           {
        path: '**',
        redirectTo: 'dresses',
        pathMatch: 'full',
      },
    ],
  },
];
