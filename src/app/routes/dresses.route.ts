import { Routes } from '@angular/router';
import { DressesPageComponent } from '../features/dresses/dresses-page.component';
import { DressListPageComponent } from '../features/dresses/pages/dress-list/dress-list-page.component';
import { DressFormPageComponent } from '../features/dresses/pages/dress-form/dress-form-page.component';
import { moduleGuard } from '../core/guards/module.guard';
import { authGuard } from '../core/guards/auth.guard';

export const dressesRoutes: Routes = [
  {
    path: 'dresses',
    component: DressesPageComponent,
    canActivate: [authGuard],
    canActivateChild: [moduleGuard],
    data: { module: 'DRESS' },
    children: [
      { path: '', component: DressListPageComponent },
      { path: 'new', component: DressFormPageComponent },
      { path: ':id', component: DressFormPageComponent }
    ]
  }
];
