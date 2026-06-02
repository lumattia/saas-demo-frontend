import { Component, Input, Output, EventEmitter, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormGroup, FormControl, ReactiveFormsModule, Validators, FormBuilder } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { CustomFieldService } from '../../../core/services/custom-field.service';
import { CustomFieldGroup, CustomFieldDefinition, CustomFieldType, FieldValidations } from '../../../core/models/custom-field.model';
import { TextInputComponent } from '../inputs/text-input/text-input.component';
import { NumberInputComponent } from '../inputs/number-input/number-input.component';
import { SelectInputComponent } from '../inputs/select-input/select-input.component';
import { CheckboxInputComponent } from '../inputs/checkbox-input/checkbox-input.component';
import { ModuleType } from '../../../core/models/tenant.model';
import { CollapsibleSectionComponent } from '../collapsible-section/collapsible-section.component';

@Component({
  selector: 'app-dynamic-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, TranslateModule, TextInputComponent, NumberInputComponent, SelectInputComponent, CheckboxInputComponent, CollapsibleSectionComponent],
  templateUrl: './dynamic-form.component.html',
  styleUrls: ['./dynamic-form.component.css']
})
export class DynamicFormComponent implements OnInit {
  private customFieldService = inject(CustomFieldService);
  private fb = inject(FormBuilder);

  @Input() form!: FormGroup;
  @Input() entityIdentifier!: string;
  @Input() module!: ModuleType;
  @Input() isEditMode = true;
  @Input() showActions = true;

  groups = signal<CustomFieldGroup[]>([]);
  loading = signal(true);
  editingGroups = new Set<number>();

  get CustomFieldType() {
    return CustomFieldType;
  }
  
  ngOnInit() {
    this.loadFieldDefinitions();
  }

  loadFieldDefinitions() {
    if (this.entityIdentifier) {
    this.customFieldService.getFormStructure(this.module, this.entityIdentifier).subscribe({
        next: (groups) => {
          this.groups.set(groups);
          this.injectControls();
          if (this.isEditMode) {
            this.groups().forEach(group => {
              this.editingGroups.add(group.id);
            });
          }
          this.loading.set(false);
        },
        error: () => {
          this.loading.set(false);
        }
      });
    } else {
      this.customFieldService.getGroupsByModule(this.module as any).subscribe({
        next: (groups) => {
          this.groups.set(groups);
          this.injectControls();
          this.loading.set(false);
        },
        error: () => {
          this.loading.set(false);
        }
      });
    }
  }
  injectControls() {
    const groups = this.groups();
    groups.forEach(group => {
      group.definitions.forEach(field => {
        const validators = this.buildValidators(field.validations);
        const control = this.fb.control(field.value || '', validators);
        this.form.addControl(`${field.id}`, control);
      });
    });
  }

  buildValidators(validations?: FieldValidations) {
    const validators: any[] = [];
    if (validations?.required) {
      validators.push(Validators.required);
    }
    if (validations?.min != undefined) {
      validators.push(Validators.min(validations.min));
    }
    if (validations?.max != undefined) {
      validators.push(Validators.max(validations.max));
    }
    if (validations?.maxLength != undefined) {
      validators.push(Validators.maxLength(validations.maxLength));
    }
    return validators;
  }

  getFormControl(fieldId: number): FormControl {
    return this.form.get(`${fieldId}`) as FormControl;
  }

  getOptionsForSelect(field: CustomFieldDefinition): { id: string; name: string }[] {
    return (field.validations?.options || []).map((opt, index) => ({
      id: opt,
      name: opt
    }));
  }

  isGroupValid(groupId: number): boolean {
    const group = this.groups().find(g => g.id === groupId);
    if (!group) return false;
    
    return group.definitions.every(field => {
      const control = this.form.get(`${field.id}`);
      return control?.valid;
    });
  }
  
  isGroupEditing(group: number): boolean {
    return this.editingGroups.has(group);
  }
  toggleGroupEdit(group: number): void {
    if (this.editingGroups.has(group)) {
      this.editingGroups.delete(group);
    } else {
      this.editingGroups.add(group);
    }
  }
  saveGroup(groupId: number): void {
    const customFields: Record<number, string> = {};
    const group = this.groups().find(g => g.id === groupId);
    if (!group) return;

    group.definitions.forEach(field => {
      const control = this.form.get(`${field.id}`);
      if (control) {
        customFields[field.id] = control.value || '';
      }
    });

    this.customFieldService.saveValues(this.module, this.entityIdentifier, { customFields }).subscribe({
      next: () => {
        const updatedDefinitions = group.definitions.map(def => ({
              ...def,
              value: customFields[def.id]
            }));
        this.groups.update(groups => groups.map(g => g.id === groupId ? { ...g, definitions: updatedDefinitions } : g));
        this.editingGroups.delete(groupId);
      },
      error: (error) => {
        console.error('Error saving custom fields:', error);
      }
    });
  }

  resetGroup(groupId: number): void {
    const group = this.groups().find(g => g.id === groupId);
        if (!group) return;

    group.definitions.forEach(field => {
      const control = this.form.get(`${field.id}`);
      if (control) {
        control.reset(field.value); 
        control.markAsPristine();
        control.markAsUntouched();
      }
    });
    this.editingGroups.delete(groupId);
  }
}
