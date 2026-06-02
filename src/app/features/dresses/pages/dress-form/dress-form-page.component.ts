import { CommonModule } from '@angular/common';
import { Component, inject, OnInit, ChangeDetectorRef } from '@angular/core';
import { ReactiveFormsModule, FormGroup, FormControl, Validators } from '@angular/forms';
import { ActivatedRoute, Router, ParamMap } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { DressService } from '../../../../core/services/dress.service';
import { CustomFieldService } from '../../../../core/services/custom-field.service';
import { Dress } from '../../../../core/models/dress.model';
import { ModuleType } from '../../../../core/models/tenant.model';
import { TextInputComponent } from '../../../../shared/components/inputs/text-input/text-input.component';
import { ColorInputComponent } from '../../../../shared/components/inputs/color-input/color-input.component';
import { NumberInputComponent } from '../../../../shared/components/inputs/number-input/number-input.component';
import { DynamicFormComponent } from '../../../../shared/components/dynamic-form/dynamic-form.component';
import { CollapsibleSectionComponent } from '../../../../shared/components/collapsible-section/collapsible-section.component';
import { ButtonComponent } from '../../../../shared/components/button/button.component';
import { CanDeactivateComponent } from '../../../../core/guards/unsaved-changes.guard';

@Component({
  selector: 'app-dress-form-page',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    TranslateModule,
    TextInputComponent,
    ColorInputComponent,
    NumberInputComponent,
    DynamicFormComponent,
    CollapsibleSectionComponent,
    ButtonComponent,
  ],
  templateUrl: './dress-form-page.component.html',
  styleUrls: ['./dress-form-page.component.css'],
})
export class DressFormPageComponent implements OnInit, CanDeactivateComponent {
  private dressService = inject(DressService);
  private customFieldService = inject(CustomFieldService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);

  id: number | null = null;
  dressForm = new FormGroup({
    title: new FormControl('', [Validators.required, Validators.maxLength(20)]),
    sku: new FormControl('', Validators.required),
    size: new FormControl(''),
    color: new FormControl('#000000'),
    price: new FormControl(0, Validators.min(0))
  });
  customFieldsForm = new FormGroup({});
  editingSections = new Set<string>();
  initialData!: Dress;
  module = ModuleType.DRESS;
  isEditMode = false;
  sectionFields: Record<string, string[]> = {
    basicInfo: ['title', 'sku', 'size'],
    details: ['color', 'price']
  };

  getControl(name: string): FormControl {
    return this.dressForm.get(name) as FormControl;
  }

  isSectionEditing(section: string): boolean {
    return this.editingSections.has(section);
  }

  toggleSectionEdit(section: string): void {
    if (this.editingSections.has(section)) {
      this.editingSections.delete(section);
    } else {
      this.editingSections.add(section);
    }
  }

  saveAll(): void {
    const formValue = this.dressForm.value;
    const dress: Partial<Dress> = {
      title: formValue.title || '',
      sku: formValue.sku || '',
      size: formValue.size || '',
      color: formValue.color || '#000000',
      price: formValue.price || 0
    };

    this.dressService.create(dress).subscribe({
      next: (createdDress) => {
        this.id = createdDress.id;
        // Save custom fields if any
        const customFields: Record<number, string> = {};
        Object.keys(this.customFieldsForm.controls).forEach(key => {
            customFields[parseInt(key)] = this.customFieldsForm.get(key)?.value || '';
        });

        if (Object.keys(customFields).length > 0) {
          this.customFieldService.saveValues(this.module, this.id, { customFields }).subscribe({
            next: () => {
              this.router.navigate(['/dresses']);
            },
            error: (error) => {
              console.error('Error saving custom fields:', error);
              this.router.navigate(['/dresses']);
            }
          });
        } else {
          this.router.navigate(['/dresses']);
        }
      },
      error: (error) => {
        console.error('Error creating dress:', error);
        alert('Error al crear el vestido. Por favor, revise los datos e inténtelo de nuevo.');
      }
    });
  }

  isSectionValid(section: string): boolean {
    const fields = this.sectionFields[section];
    if (!fields) return true;
    let isValid = true;
    fields.forEach(f => {
      const ctrl = this.dressForm.get(f);
      if (ctrl?.invalid) isValid = false;
    });
    return isValid;
  }
  
  saveSection(section: string): void {
    if (!this.id) return;

    const fields = this.sectionFields[section];
    if (!fields) return;

    const partialDress: Partial<Dress> = { ...this.initialData };
    fields.forEach(f => {
      partialDress[f as keyof Dress] = this.dressForm.get(f)?.value;
    });
    this.dressService.update(this.id, partialDress).subscribe({
      next: () => {
        fields.forEach(f => {
          let control = this.dressForm.get(f);
          if (control) {
            this.initialData = partialDress as Dress;
            control.markAsPristine();
          }
        });
        this.editingSections.delete(section);
      },
      error: (error) => {
        console.error('Error saving:', error);
      }
    });
  }

  resetSection(section: string): void {
    const fields = this.sectionFields[section];
    fields.forEach(f => {
      const originalValue = this.initialData[f as keyof Dress];
      this.dressForm.get(f)?.reset(originalValue);
    });

    this.editingSections.delete(section);
  }

  ngOnInit() {
    const idParam = this.route.snapshot.paramMap.get('id');
    if (idParam && idParam !== 'new') {
      this.id = +idParam;
      this.route.queryParamMap.subscribe((params: ParamMap) => {
        const editParam = params.get('edit');
        if (editParam === 'true') {
          this.isEditMode = true;
          this.editingSections.add('basicInfo');
          this.editingSections.add('details');
        }
      });
      this.dressService.getById(this.id).subscribe(data => {
        this.initialData = data;
        this.dressForm.patchValue({
          title: data.title,
          sku: data.sku,
          size: data.size,
          color: data.color,
          price: data.price
        });
      });
    }
  }

  canDeactivate(): boolean | Promise<boolean> {
    return this.dressForm.dirty || this.customFieldsForm.dirty;
  }
}
