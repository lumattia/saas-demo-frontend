import { Routes } from '@angular/router';
import { InventoryPageComponent } from '../features/inventory/inventory-page.component';
import { InventoryListPageComponent } from '../features/inventory/pages/inventory-list/inventory-list-page.component';
import { InventoryFormPageComponent } from '../features/inventory/pages/inventory-form/inventory-form-page.component';
import { moduleGuard } from '../core/guards/module.guard';
import { authGuard } from '../core/guards/auth.guard';

export const inventoryRoutes: Routes = [
  {
    path: 'inventory',
    component: InventoryPageComponent,
    canActivate: [authGuard],
    canActivateChild: [moduleGuard],
    data: { module: 'INVENTORY' },
    children: [
      { path: '', component: InventoryListPageComponent },
      { path: 'new', component: InventoryFormPageComponent },
      { path: ':id', component: InventoryFormPageComponent }
    ]
  }
];
