import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-number-input',
  standalone: true,
  imports: [CommonModule, FormsModule, TranslateModule],
  templateUrl: './number-input.component.html',
  styleUrls: ['./number-input.component.css'],
})
export class NumberInputComponent {
  @Input() labelKey = '';
  @Input() placeholderKey = '';
  @Input() value = 0;
  @Input() decimalPlaces = 0;
  @Input() unit = '';
  @Input() required = false;
  @Input() disabled = false;
  @Input() min?: number;
  @Input() max?: number;
  @Input() errorKey = '';
  @Output() valueChange = new EventEmitter<number>();

  get step(): string {
    return this.decimalPlaces > 0 ? `0.${'0'.repeat(this.decimalPlaces - 1)}1` : '1';
  }

  get displayValue(): string {
    return this.decimalPlaces > 0 
      ? this.value.toFixed(this.decimalPlaces) 
      : this.value.toString();
  }

  onValueChange(event: Event): void {
    const input = event.target as HTMLInputElement;
    const rawValue = parseFloat(input.value);
    
    if (isNaN(rawValue)) {
      this.valueChange.emit(0);
      return;
    }

    const roundedValue = this.decimalPlaces > 0
      ? parseFloat(rawValue.toFixed(this.decimalPlaces))
      : Math.round(rawValue);

    this.valueChange.emit(roundedValue);
  }
}
