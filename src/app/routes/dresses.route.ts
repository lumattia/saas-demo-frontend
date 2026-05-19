import { Routes } from '@angular/router';
import { DressListPageComponent } from '../features/dresses/pages/dress-list/dress-list-page.component';
import { DressFormPageComponent } from '../features/dresses/pages/dress-form/dress-form-page.component';
import { moduleGuard } from '../core/guards/module.guard';
import { authGuard } from '../core/guards/auth.guard';

export const dressesRoutes: Routes = [
  {
    path: 'dresses', component: DressListPageComponent,
    canActivateChild: [authGuard, moduleGuard], data: { module: 'DRESS' }, 
    children:[
      { path: 'new', component: DressFormPageComponent },
      { path: ':id', component: DressFormPageComponent }
    ]
  },
];
