import { Component, Input, Output, EventEmitter } from '@angular/core';
import { FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-text-input',
  standalone: true,
  imports: [ReactiveFormsModule, TranslateModule],
  templateUrl: './text-input.component.html',
  styleUrls: ['./text-input.component.css'],
})
export class TextInputComponent {
  @Input() labelKey = '';
  @Input() placeholderKey = '';
  @Input() control: FormControl | null = null;
  @Input() value: any = null;
  @Input() type = 'text';
  @Input() required = false;
  @Input() disabled = false;
  @Input() readonly = false;
  @Input() maxLength?: number;
  @Input() errorKey = '';
  @Input() showDirtyIndicator = false;

  @Output() valueChange = new EventEmitter<any>();

  get isDirty(): boolean {
    return this.showDirtyIndicator && !!this.control?.dirty;
  }

  get internalControl(): FormControl {
    return this.control || new FormControl(this.value);
  }

  get shouldShowError(): boolean {
    const ctrl = this.internalControl;
    return ctrl.invalid && (ctrl.dirty || ctrl.touched);
  }

  get errorMessage(): string {
    const ctrl = this.internalControl;
    if (!this.shouldShowError) return '';

    // Check errors in priority order
    if (ctrl.hasError('required')) {
      return this.errorKey || 'validation.required';
    }
    if (ctrl.hasError('minlength')) {
      return this.errorKey || 'validation.minLength';
    }
    if (ctrl.hasError('maxlength')) {
      return this.errorKey || 'validation.maxLength';
    }
    if (ctrl.hasError('pattern')) {
      return this.errorKey || 'validation.pattern';
    }
    if (ctrl.hasError('email')) {
      return this.errorKey || 'validation.email';
    }

    return this.errorKey || 'validation.invalid';
  }

  onValueChange(event: Event): void {
    const input = event.target as HTMLInputElement;
    const newValue = input.value;
    if (this.control) {
      this.control.setValue(newValue);
    } else {
      this.valueChange.emit(newValue);
    }
  }
}
