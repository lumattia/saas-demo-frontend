import { Component, Input } from '@angular/core';
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
  @Input() control: FormControl = new FormControl(0);
  @Input() decimalPlaces = 0;
  @Input() unit = '';
  @Input() required = false;
  @Input() disabled = false;
  @Input() min?: number;
  @Input() max?: number;
  @Input() errorKey = '';
  @Input() showDirtyIndicator = false;

  get step(): string {
    return this.decimalPlaces > 0 ? `0.${'0'.repeat(this.decimalPlaces - 1)}1` : '1';
  }

  get displayValue(): string {
    const value = this.control.value || 0;
    return this.decimalPlaces > 0 
      ? value.toFixed(this.decimalPlaces) 
      : value.toString();
  }

  get isDirty(): boolean {
    return this.showDirtyIndicator && this.control.dirty;
  }
}
