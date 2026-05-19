import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
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
    FormsModule,
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
  tenant: Partial<TenantCreateRequest | TenantUpdateRequest> = { name: '', modules: [] };
  moduleOptions = [
    { id: ModuleType.DRESS, name: 'tenants.form.modules.dress' },
    { id: ModuleType.INVENTORY, name: 'tenants.form.modules.inventory' },
  ];

  ngOnInit() {
    const idParam = this.route.snapshot.paramMap.get('id');
    if (idParam && idParam !== 'new') {
      this.id = idParam;
      this.tenantService.getById(this.id).subscribe(data => {
        this.tenant = {
          id: data.id,
          name: data.name,
          modules: data.modules || [],
        };
      });
    }
  }

  save(): void {
    if (this.id) {
      const updateRequest: TenantUpdateRequest = {
        id: this.id,
        name: this.tenant.name || '',
        modules: this.tenant.modules || [],
      };
      this.tenantService.update(this.id, updateRequest).subscribe(() => {
        this.router.navigate(['/tenants']);
      });
    } else {
      const createRequest: TenantCreateRequest = {
        name: this.tenant.name || '',
        modules: this.tenant.modules || [],
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
    const modules = this.tenant.modules || [];
    if (target && (target as HTMLInputElement).checked) {
      modules.push(module);
    } else {
      const index = modules.indexOf(module);
      if (index > -1) {
        modules.splice(index, 1);
      }
    }
    this.tenant.modules = modules;
  }
}
