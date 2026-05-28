import { Component, Input, Output, EventEmitter, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormGroup, FormControl, ReactiveFormsModule, Validators, FormBuilder } from '@angular/forms';
import { CustomFieldService } from '../../../core/services/custom-field.service';
import { CustomFieldGroup, CustomFieldDefinition, CustomFieldType, FieldValidations } from '../../../core/models/custom-field.model';
import { TextInputComponent } from '../inputs/text-input/text-input.component';
import { NumberInputComponent } from '../inputs/number-input/number-input.component';
import { SelectInputComponent } from '../inputs/select-input/select-input.component';

@Component({
  selector: 'app-dynamic-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, TextInputComponent, NumberInputComponent, SelectInputComponent],
  templateUrl: './dynamic-form.component.html',
  styleUrls: ['./dynamic-form.component.css']
})
export class DynamicFormComponent implements OnInit {
  private customFieldService = inject(CustomFieldService);
  private fb = inject(FormBuilder);

  @Input() parentForm!: FormGroup;
  @Input() entityIdentifier!: string;
  @Input() module!: string;

  @Output() formReady = new EventEmitter<void>();

  groups = signal<CustomFieldGroup[]>([]);
  loading = signal(true);

  get CustomFieldType() {
    return CustomFieldType;
  }
  
  ngOnInit() {
    this.loadFieldDefinitions();
  }

  loadFieldDefinitions() {
    this.customFieldService.getGroupsByModule(this.module as any).subscribe({
      next: (groups) => {
        this.groups.set(groups);
        this.injectControls();
        this.loading.set(false);
        this.formReady.emit();
      },
      error: () => {
        this.loading.set(false);
      }
    });
  }

  injectControls() {
    const groups = this.groups();
    groups.forEach(group => {
      group.definitions.forEach(field => {
        const validators = this.buildValidators(field.validations);
        const control = this.fb.control('', validators);
        this.parentForm.addControl(`custom_${field.id}`, control);
      });
    });
  }

  buildValidators(validations?: FieldValidations) {
    const validators: any[] = [];
    
    if (validations?.required) {
      validators.push(Validators.required);
    }
    if (validations?.min !== undefined) {
      validators.push(Validators.min(validations.min));
    }
    if (validations?.max !== undefined) {
      validators.push(Validators.max(validations.max));
    }
    if (validations?.maxLength !== undefined) {
      validators.push(Validators.maxLength(validations.maxLength));
    }

    return validators;
  }

  getFormControl(fieldId: number): FormControl {
    return this.parentForm.get(`custom_${fieldId}`) as FormControl;
  }

  getOptionsForSelect(field: CustomFieldDefinition): { id: string; name: string }[] {
    return (field.validations?.options || []).map((opt, index) => ({
      id: opt,
      name: opt
    }));
  }

  shouldShowNumberValidations(field: CustomFieldDefinition): boolean {
    return field.type === CustomFieldType.NUMBER;
  }

  shouldShowTextValidations(field: CustomFieldDefinition): boolean {
    return field.type === CustomFieldType.TEXT;
  }

  shouldShowSelectOptions(field: CustomFieldDefinition): boolean {
    return field.type === CustomFieldType.SELECT;
  }
}
