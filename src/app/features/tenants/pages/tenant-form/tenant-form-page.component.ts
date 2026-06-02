import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { ReactiveFormsModule, FormGroup, FormControl, Validators } from '@angular/forms';
import { ActivatedRoute, Router, ParamMap } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { TenantService } from '../../../../core/services/tenant.service';
import { TenantCreateRequest, TenantUpdateRequest, ModuleType } from '../../../../core/models/tenant.model';
import { TextInputComponent } from '../../../../shared/components/inputs/text-input/text-input.component';
import { ButtonComponent } from '../../../../shared/components/button/button.component';
import { CanDeactivateComponent } from '../../../../core/guards/unsaved-changes.guard';

@Component({
  selector: 'app-tenant-form-page',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    TranslateModule,
    TextInputComponent,
    ButtonComponent,
  ],
  templateUrl: './tenant-form-page.component.html',
  styleUrls: ['./tenant-form-page.component.css'],
})
export class TenantFormPageComponent implements OnInit, CanDeactivateComponent {
  private tenantService = inject(TenantService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);

  id: string | null = null;
  tenantForm = new FormGroup({
    name: new FormControl('', [Validators.required])
  });
  modules: ModuleType[] = [];
  moduleOptions = [
    { id: ModuleType.DRESS, name: 'tenants.form.modules.DRESS' },
    { id: ModuleType.DRESS_MOVEMENT, name: 'tenants.form.modules.DRESS_MOVEMENT' },
  ];
  isEditMode = false;
  initialData: any = null;

  getControl(name: string): FormControl {
    return this.tenantForm.get(name) as FormControl;
  }

  ngOnInit() {
    const idParam = this.route.snapshot.paramMap.get('id');
    if (idParam && idParam !== 'new') {
      this.id = idParam;
      this.isEditMode = false;
      
      this.route.queryParamMap.subscribe((params: ParamMap) => {
        const editParam = params.get('edit');
        if (editParam === 'true') {
          this.isEditMode = true;
        }
      });

      this.tenantService.getById(this.id).subscribe(data => {
        this.initialData = {
          name: data.name,
          modules: data.modules || []
        };
        this.tenantForm.patchValue({
          name: data.name
        });
        this.modules = data.modules || [];
      });
    } else {
      this.isEditMode = true;
    }
  }

  save(): void {
    const formValue = this.tenantForm.value;
    if (this.id) {
      const updateRequest: TenantUpdateRequest = {
        id: this.id,
        name: formValue.name || '',
        modules: this.modules || [],
      };
      this.tenantService.update(this.id, updateRequest).subscribe(() => {
        this.router.navigate(['/tenants']);
      });
    } else {
      const createRequest: TenantCreateRequest = {
        name: formValue.name || '',
        modules: this.modules || [],
      };
      this.tenantService.create(createRequest).subscribe(() => {
        this.router.navigate(['/tenants']);
      });
    }
  }


  exit(): void {
    this.router.navigate(['/tenants']);
  }

  enableEditMode(): void {
    this.isEditMode = true;
  }

  cancelEdit(): void {
    if (!this.id) {
      this.router.navigate(['/tenants']);
      return;
    }
    this.isEditMode = false;
    if (this.initialData) {
      this.tenantForm.patchValue({
        name: this.initialData.name
      });
      this.modules = this.initialData.modules;
    }
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: { edit: null },
      queryParamsHandling: 'merge'
    });
  }

  onModuleChange(module: ModuleType, target: EventTarget|null) {
    if (target && (target as HTMLInputElement).checked) {
      this.modules.push(module);
    } else {
      const index = this.modules.indexOf(module);
      if (index > -1) {
        this.modules.splice(index, 1);
      }
    }
  }

  canDeactivate(): boolean | Promise<boolean> {
    return this.tenantForm.dirty;
  }
}
