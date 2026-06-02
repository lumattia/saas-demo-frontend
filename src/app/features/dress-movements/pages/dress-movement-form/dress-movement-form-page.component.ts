import { Component, inject, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormGroup, FormControl, Validators } from '@angular/forms';
import { ActivatedRoute, Router, ParamMap } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { DressMovementService } from '../../../../core/services/dress-movement.service';
import { DressService } from '../../../../core/services/dress.service';
import { CustomFieldService } from '../../../../core/services/custom-field.service';
import { DressMovement } from '../../../../core/models/dress-movement.model';
import { ModuleType } from '../../../../core/models/tenant.model';
import { IdName } from '../../../../core/models/common.models';
import { SelectInputComponent } from '../../../../shared/components/inputs/select-input/select-input.component';
import { NumberInputComponent } from '../../../../shared/components/inputs/number-input/number-input.component';
import { DynamicFormComponent } from '../../../../shared/components/dynamic-form/dynamic-form.component';
import { CollapsibleSectionComponent } from '../../../../shared/components/collapsible-section/collapsible-section.component';
import { ButtonComponent } from '../../../../shared/components/button/button.component';
import { CanDeactivateComponent } from '../../../../core/guards/unsaved-changes.guard';

@Component({
  selector: 'app-dress-movement-form-page',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, TranslateModule, SelectInputComponent, NumberInputComponent, DynamicFormComponent, CollapsibleSectionComponent, ButtonComponent],
  templateUrl: './dress-movement-form-page.component.html',
  styleUrls: ['./dress-movement-form-page.component.css'],
})
export class DressMovementFormPageComponent implements OnInit, CanDeactivateComponent {
  private dressMovementService = inject(DressMovementService);
  private dressService = inject(DressService);
  private customFieldService = inject(CustomFieldService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private cdr = inject(ChangeDetectorRef);

  id: number | null = null;
  dressMovementForm = new FormGroup({
    dressId: new FormControl('', [Validators.required]),
    quantity: new FormControl('', [Validators.required, Validators.min(1)])
  });
  customFieldsForm = new FormGroup({});
  dresses: IdName[] = [];
  editingSections = new Set<string>();
  initialData: any = null;
  module = ModuleType.DRESS_MOVEMENT;
  isEditMode = false;

  sectionFields: Record<string, string[]> = {
    basicInfo: ['dressId', 'quantity']
  };

  getControl(name: string): FormControl {
    return this.dressMovementForm.get(name) as FormControl;
  }

  isSectionEditing(section: string): boolean {
    return this.editingSections.has(section);
  }

  isSectionValid(section: string): boolean {
    const fields = this.sectionFields[section];
    if (!fields) return true;

    return fields.every(field => {
      const control = this.dressMovementForm.get(field);
      return control?.valid;
    });
  }

  toggleSectionEdit(section: string): void {
    if (this.editingSections.has(section)) {
      this.editingSections.delete(section);
    } else {
      this.editingSections.add(section);
    }
    this.cdr.detectChanges();
  }

  saveAll(): void {
    const formValue = this.dressMovementForm.value;
    const item: Partial<DressMovement> = {
      dressId: formValue.dressId ? Number(formValue.dressId) : 0,
      quantity: formValue.quantity ? Number(formValue.quantity) : 0
    };

    this.dressMovementService.create(item).subscribe({
      next: (createdMovement) => {
        this.id = createdMovement.id;
        // Save custom fields if any
        const customFields: Record<number, string> = {};
        Object.keys(this.customFieldsForm.controls).forEach(key => {
            customFields[parseInt(key)] = this.customFieldsForm.get(key)?.value || '';
        });

        if (Object.keys(customFields).length > 0) {
          this.customFieldService.saveValues(this.module, this.id, { customFields }).subscribe({
            next: () => {
              alert('Movimiento creado correctamente.');
              this.router.navigate(['/dress-movements']);
            },
            error: (error) => {
              console.error('Error saving custom fields:', error);
              alert('Error al guardar los campos personalizados. El movimiento se creó pero sin campos personalizados.');
              this.router.navigate(['/dress-movements']);
            }
          });
        } else {
          alert('Movimiento creado correctamente.');
          this.router.navigate(['/dress-movements']);
        }
      },
      error: (error) => {
        console.error('Error creating dress movement:', error);
        alert('Error al crear el movimiento. Por favor, revise los datos e inténtelo de nuevo.');
      }
    });
  }

  saveSection(section: string): void {
    if (!this.id) return;

    const fields = this.sectionFields[section];
    if (!fields) return;

    const formValue = this.dressMovementForm.value;
    const item: any = {};

    fields.forEach(field => {
      if (field === 'dressId') {
        (item as any)[field] = (formValue as any)[field] ? Number((formValue as any)[field]) : 0;
      } else if (field === 'quantity') {
        (item as any)[field] = (formValue as any)[field] ? Number((formValue as any)[field]) : 0;
      } else {
        (item as any)[field] = (formValue as any)[field] || '';
      }
    });

    if (Object.keys(item).length === 0) {
      alert('No hay cambios para guardar.');
      return;
    }

    this.dressMovementService.update(this.id, item as Partial<DressMovement>).subscribe({
      next: () => {
        Object.keys(item).forEach(key => {
          (this.initialData as any)[key] = (item as any)[key];
        });
        this.editingSections.delete(section);
        this.cdr.detectChanges();
        alert('Información guardada correctamente.');
      },
      error: (error) => {
        console.error('Error saving:', error);
        alert('Error al guardar. Por favor, revise los datos e inténtelo de nuevo.');
      }
    });
  }

  resetSection(section: string): void {
    const fields = this.sectionFields[section];
    if (!fields) return;

    const resetValue: any = {};
    fields.forEach(field => {
      resetValue[field] = this.initialData[field];
    });

    this.dressMovementForm.patchValue(resetValue);
    this.editingSections.delete(section);
    this.cdr.detectChanges();
  }

  ngOnInit() {
    const idParam = this.route.snapshot.paramMap.get('id');
    if (idParam && idParam !== 'new') {
      this.id = +idParam;

      this.dressMovementService.getById(this.id).subscribe((data: DressMovement) => {
        this.initialData = {
          dressId: data.dress.id.toString(),
          quantity: data.quantity.toString(),
          dress: data.dress
        };
        this.dressMovementForm.patchValue({
          dressId: data.dress.id.toString(),
          quantity: data.quantity.toString()
        });
        this.cdr.detectChanges();
      });
    }
    this.dressService.list().subscribe(data => this.dresses = data);

    this.route.queryParamMap.subscribe((params: ParamMap) => {
      const editParam = params.get('edit');
      if (editParam === 'true') {
        this.isEditMode = true;
        this.editingSections.add('basicInfo');
      }
    });
  }

  canDeactivate(): boolean | Promise<boolean> {
    return this.dressMovementForm.dirty || this.customFieldsForm.dirty;
  }
}
