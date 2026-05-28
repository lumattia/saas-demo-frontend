import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { ReactiveFormsModule, FormGroup, FormControl } from '@angular/forms';
import { ActivatedRoute, Router, ParamMap } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { UserService } from '../../../../core/services/user.service';
import { AuthService } from '../../../../core/services/auth.service';
import { User, UserCreateRequest, UserUpdateRequest } from '../../../../core/models/user.model';
import { TextInputComponent } from '../../../../shared/components/inputs/text-input/text-input.component';
import { SelectInputComponent } from '../../../../shared/components/inputs/select-input/select-input.component';
import { EnumService } from '../../../../core/services/enum.service';
import { ButtonComponent } from '../../../../shared/components/button/button.component';
import { CanDeactivateComponent } from '../../../../core/guards/unsaved-changes.guard';
import { ModalService } from '../../../../shared/services/modal.service';
import { UnsavedChangesModalComponent } from '../../../../shared/components/modals/unsaved-changes-modal/unsaved-changes-modal.component';

@Component({
  selector: 'app-user-form-page',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    TranslateModule,
    TextInputComponent,
    SelectInputComponent,
    ButtonComponent,
  ],
  templateUrl: './user-form-page.component.html',
  styleUrls: ['./user-form-page.component.css'],
})
export class UserFormPageComponent implements OnInit, CanDeactivateComponent {
  private userService = inject(UserService);
  private enumService = inject(EnumService);
  private authService = inject(AuthService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private modalService = inject(ModalService);

  id: number | null = null;
  userForm = new FormGroup({
    username: new FormControl(''),
    role: new FormControl('USER')
  });
  allowedTenantIds: string[] = [];
  assignableRoles: string[] = [];
  isEditMode = false;
  initialData: any = null;
  isEditable = true;

  get roleOptions() {
    return this.assignableRoles.map(role => ({
      id: role,
      name: `users.form.roleOptions.${role}`
    }));
  }

  get usernameControl(): FormControl {
    return this.userForm.controls['username'] as FormControl;
  }

  get roleControl(): FormControl {
    return this.userForm.controls['role'] as FormControl;
  }

  ngOnInit() {
    const idParam = this.route.snapshot.paramMap.get('id');
    if (idParam && idParam !== 'new') {
      this.id = +idParam;
      this.isEditMode = false;
      
      this.route.queryParamMap.subscribe((params: ParamMap) => {
        const editParam = params.get('edit');
        if (editParam === 'true') {
          this.isEditMode = true;
        }
      });

      this.userService.getById(this.id).subscribe(data => {
        this.initialData = {
          username: data.username,
          role: data.role,
          allowedTenantIds: data.allowedTenants?.map(t => t.id.toString()) || []
        };
        this.userForm.patchValue({
          username: data.username,
          role: data.role
        });
        this.allowedTenantIds = data.allowedTenants?.map(t => t.id.toString()) || [];
        this.isEditable = data.isEditable !== false;
        
        this.enumService.getAssignableRoles().subscribe(roles => {
          this.assignableRoles = roles;
          
          // If editing own profile and current role not in assignable roles, add it manually
          const currentUser = this.authService.user();
          if (currentUser && this.id === currentUser.id && !roles.includes(currentUser.role)) {
            this.assignableRoles = [...roles, currentUser.role];
          }
        });
      });
    } else {
      this.isEditMode = true;
      this.enumService.getAssignableRoles().subscribe(roles => {
        this.assignableRoles = roles;
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

  enableEditMode(): void {
    this.isEditMode = true;
  }

  cancelEdit(): void {
    if (!this.id) {
      this.router.navigate(['/users']);
      return;
    }
    this.isEditMode = false;
    if (this.initialData) {
      this.userForm.patchValue({
        username: this.initialData.username,
        role: this.initialData.role
      });
      this.allowedTenantIds = this.initialData.allowedTenantIds;
    }
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: { edit: null },
      queryParamsHandling: 'merge'
    });
  }

  exit(): void {
    this.router.navigate(['/users']);
  }

  canDeactivate(): boolean | Promise<boolean> {
    if (!this.userForm.dirty || !this.isEditMode) {
      return true;
    }
    
    const modalRef = this.modalService.open(UnsavedChangesModalComponent, {
      open: true
    });
    
    return modalRef.result;
  }
}
