import { Routes } from '@angular/router';
import { UsersPageComponent } from '../features/users/users-page.component';
import { UserListPageComponent } from '../features/users/pages/user-list/user-list-page.component';
import { UserFormPageComponent } from '../features/users/pages/user-form/user-form-page.component';
import { moduleGuard } from '../core/guards/module.guard';
import { authGuard } from '../core/guards/auth.guard';
import { roleGuard } from '../core/guards/role.guard';

export const usersRoutes: Routes = [
  {
    path: 'users',
    component: UsersPageComponent,
    canActivate: [authGuard, roleGuard],
    data: { requiredRole: 'ADMIN' },
    children: [
      { path: '', component: UserListPageComponent },
      { path: 'new', component: UserFormPageComponent },
      { path: ':id', component: UserFormPageComponent }
    ]
  }
];
