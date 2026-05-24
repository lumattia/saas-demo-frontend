import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { ReactiveFormsModule, FormGroup, FormControl } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { UserService } from '../../../../core/services/user.service';
import { User, UserCreateRequest, UserUpdateRequest } from '../../../../core/models/user.model';
import { TextInputComponent } from '../../../../shared/components/inputs/text-input/text-input.component';
import { SelectInputComponent } from '../../../../shared/components/inputs/select-input/select-input.component';
import { EnumService } from '../../../../core/services/enum.service';

@Component({
  selector: 'app-user-form-page',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    TranslateModule,
    TextInputComponent,
    SelectInputComponent,
  ],
  templateUrl: './user-form-page.component.html',
  styleUrls: ['./user-form-page.component.css'],
})
export class UserFormPageComponent implements OnInit {
  private userService = inject(UserService);
  private enumService = inject(EnumService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);

  id: number | null = null;
  userForm = new FormGroup({
    username: new FormControl(''),
    role: new FormControl('USER')
  });
  allowedTenantIds: string[] = [];
  assignableRoles: string[] = [];

  get roleOptions() {
    return this.assignableRoles.map(role => ({
      id: role,
      name: `users.form.roleOptions.${role.toLowerCase()}`
    }));
  }

  get usernameControl(): FormControl {
    return this.userForm.controls['username'] as FormControl;
  }

  get roleControl(): FormControl {
    return this.userForm.controls['role'] as FormControl;
  }

  ngOnInit() {
    this.enumService.getAssignableRoles().subscribe(roles => {
      this.assignableRoles = roles;
    });

    const idParam = this.route.snapshot.paramMap.get('id');
    if (idParam && idParam !== 'new') {
      this.id = +idParam;
      this.userService.getById(this.id).subscribe(data => {
        this.userForm.patchValue({
          username: data.username,
          role: data.role
        });
        this.allowedTenantIds = data.allowedTenants?.map(t => t.id.toString()) || [];
      });
    }
  }

  save(): void {
    const formValue = this.userForm.value;
    if (this.id) {
      const updateRequest: UserUpdateRequest = {
        id: this.id,
        username: formValue.username || '',
        role: (formValue.role || 'USER') as 'USER' | 'ADMIN' | 'SUPERADMIN',
        allowedTenantIds: this.allowedTenantIds,
      };
      this.userService.update(this.id, updateRequest).subscribe(() => {
        this.router.navigate(['/users']);
      });
    } else {
      const createRequest: UserCreateRequest = {
        username: formValue.username || '',
        role: (formValue.role || 'USER') as 'USER' | 'ADMIN' | 'SUPERADMIN',
        allowedTenantIds: this.allowedTenantIds,
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

  canDeactivate(): boolean {
    return !this.userForm.dirty;
  }
}
