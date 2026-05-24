import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-number-input',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, TranslateModule],
  templateUrl: './number-input.component.html',
  styleUrls: ['./number-input.component.css'],
})
export class NumberInputComponent {
  @Input() labelKey = '';
  @Input() placeholderKey = '';
  @Input() control: FormControl | null = null;
  @Input() value: number | null = null;
  @Input() decimalPlaces = 0;
  @Input() unit = '';
  @Input() required = false;
  @Input() disabled = false;
  @Input() readonly = false;
  @Input() min?: number;
  @Input() max?: number;
  @Input() errorKey = '';
  @Input() showDirtyIndicator = false;

  @Output() valueChange = new EventEmitter<number>();

  get step(): string {
    return this.decimalPlaces > 0 ? `0.${'0'.repeat(this.decimalPlaces - 1)}1` : '1';
  }

  get internalControl(): FormControl {
    return this.control || new FormControl(this.value ?? 0);
  }

  get displayValue(): string {
    const value = this.internalControl.value || 0;
    return this.decimalPlaces > 0
      ? value.toFixed(this.decimalPlaces)
      : value.toString();
  }

  get isDirty(): boolean {
    return this.showDirtyIndicator && !!this.control?.dirty;
  }

  onValueChange(event: Event): void {
    const input = event.target as HTMLInputElement;
    const newValue = input.value ? parseFloat(input.value) : null;
    if (this.control) {
      this.control.setValue(newValue);
    } else {
      this.valueChange.emit(newValue ?? 0);
    }
  }
}
