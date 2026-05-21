import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { ReactiveFormsModule, FormGroup, FormControl } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { TenantService } from '../../../../core/services/tenant.service';
import { Tenant, TenantCreateRequest, TenantUpdateRequest, ModuleType } from '../../../../core/models/tenant.model';
import { TextInputComponent } from '../../../../shared/components/inputs/text-input/text-input.component';

@Component({
  selector: 'app-tenant-form-page',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    TranslateModule,
    TextInputComponent,
  ],
  templateUrl: './tenant-form-page.component.html',
  styleUrls: ['./tenant-form-page.component.css'],
})
export class TenantFormPageComponent implements OnInit {
  private tenantService = inject(TenantService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);

  id: string | null = null;
  tenantForm = new FormGroup({
    name: new FormControl('')
  });
  modules: ModuleType[] = [];
  moduleOptions = [
    { id: ModuleType.DRESS, name: 'tenants.form.modules.dress' },
    { id: ModuleType.INVENTORY, name: 'tenants.form.modules.inventory' },
  ];

  get nameControl(): FormControl {
    return this.tenantForm.controls['name'] as FormControl;
  }

  ngOnInit() {
    const idParam = this.route.snapshot.paramMap.get('id');
    if (idParam && idParam !== 'new') {
      this.id = idParam;
      this.tenantService.getById(this.id).subscribe(data => {
        this.tenantForm.patchValue({
          name: data.name
        });
        this.modules = data.modules || [];
      });
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

  delete(): void {
    if (this.id && confirm('Are you sure you want to delete this tenant?')) {
      this.tenantService.delete(this.id).subscribe(() => {
        this.router.navigate(['/tenants']);
      });
    }
  }

  exit(): void {
    this.router.navigate(['/tenants']);
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

  canDeactivate(): boolean {
    return !this.tenantForm.dirty && this.modules.length === 0;
  }
}
