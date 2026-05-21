import { Routes } from '@angular/router';
import { DressMovementPageComponent } from '../features/dress-movements/dress-movement-page.component';
import { DressMovementListPageComponent } from '../features/dress-movements/pages/dress-movement-list/dress-movement-list-page.component';
import { DressMovementFormPageComponent } from '../features/dress-movements/pages/dress-movement-form/dress-movement-form-page.component';
import { moduleGuard } from '../core/guards/module.guard';
import { authGuard } from '../core/guards/auth.guard';

export const dressMovementRoutes: Routes = [
  {
    path: 'dress-movements',
    component: DressMovementPageComponent,
    canActivate: [authGuard],
    canActivateChild: [moduleGuard],
    data: { module: 'INVENTORY' },
    children: [
      { path: '', component: DressMovementListPageComponent },
      { path: 'new', component: DressMovementFormPageComponent },
      { path: ':id', component: DressMovementFormPageComponent }
    ]
  }
];
