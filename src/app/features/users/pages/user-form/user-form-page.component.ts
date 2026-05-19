import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { UserService } from '../../../../core/services/user.service';
import { User, UserCreateRequest, UserUpdateRequest } from '../../../../core/models/user.model';
import { TextInputComponent } from '../../../../shared/components/inputs/text-input/text-input.component';
import { SelectInputComponent } from '../../../../shared/components/inputs/select-input/select-input.component';

@Component({
  selector: 'app-user-form-page',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    TranslateModule,
    TextInputComponent,
    SelectInputComponent,
  ],
  templateUrl: './user-form-page.component.html',
  styleUrls: ['./user-form-page.component.css'],
})
export class UserFormPageComponent implements OnInit {
  private userService = inject(UserService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);

  id: number | null = null;
  user: Partial<UserCreateRequest | UserUpdateRequest> = { username: '', role: 'USER', allowedTenantIds: [] };
  roleOptions = [
    { id: 'USER', name: 'users.form.roleOptions.user' },
    { id: 'ADMIN', name: 'users.form.roleOptions.admin' },
    { id: 'SUPERADMIN', name: 'users.form.roleOptions.superadmin' },
  ];

  ngOnInit() {
    const idParam = this.route.snapshot.paramMap.get('id');
    if (idParam && idParam !== 'new') {
      this.id = +idParam;
      this.userService.getById(this.id).subscribe(data => {
        this.user = {
          id: data.id,
          username: data.username,
          role: data.role,
          allowedTenantIds: data.allowedTenants?.map(t => t.id) || [],
        };
      });
    }
  }

  onRoleChange(value: string | number): void {
    this.user.role = value as 'USER' | 'ADMIN' | 'SUPERADMIN';
  }

  save(): void {
    if (this.id) {
      const updateRequest: UserUpdateRequest = {
        id: this.id,
        username: this.user.username || '',
        role: this.user.role || 'USER',
        allowedTenantIds: this.user.allowedTenantIds,
      };
      this.userService.update(this.id, updateRequest).subscribe(() => {
        this.router.navigate(['/users']);
      });
    } else {
      const createRequest: UserCreateRequest = {
        username: this.user.username || '',
        role: this.user.role || 'USER',
        allowedTenantIds: this.user.allowedTenantIds,
      };
      this.userService.create(createRequest).subscribe(() => {
        this.router.navigate(['/users']);
      });
    }
  }

  delete(): void {
    if (this.id && confirm('Are you sure you want to delete this user?')) {
      this.userService.delete(this.id).subscribe(() => {
        this.router.navigate(['/users']);
      });
    }
  }

  exit(): void {
    this.router.navigate(['/users']);
  }
}
