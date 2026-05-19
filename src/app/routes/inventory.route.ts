import { Routes } from '@angular/router';
import { InventoryListPageComponent } from '../features/inventory/pages/inventory-list/inventory-list-page.component';
import { InventoryFormPageComponent } from '../features/inventory/pages/inventory-form/inventory-form-page.component';
import { moduleGuard } from '../core/guards/module.guard';
import { authGuard } from '../core/guards/auth.guard';

export const inventoryRoutes: Routes = [
  {
    path: 'inventory', component: InventoryListPageComponent,
    canActivate: [authGuard, moduleGuard], data: { module: 'INVENTORY' }, 
    children:[
      { path: 'new', component: InventoryFormPageComponent },
      { path: ':id', component: InventoryFormPageComponent }
    ]
  },
];
