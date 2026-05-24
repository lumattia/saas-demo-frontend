import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-color-input',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, TranslateModule],
  templateUrl: './color-input.component.html',
  styleUrls: ['./color-input.component.css'],
})
export class ColorInputComponent {
  @Input() labelKey = '';
  @Input() control: FormControl | null = null;
  @Input() value: string | null = null;
  @Input() disabled = false;
  @Input() readonly = false;
  @Input() errorKey = '';
  @Input() showDirtyIndicator = false;

  @Output() valueChange = new EventEmitter<string>();

  private hexColorRegex = /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/;

  get internalControl(): FormControl {
    return this.control || new FormControl(this.value ?? '#000000');
  }

  get isValid(): boolean {
    return this.hexColorRegex.test(this.internalControl.value || '');
  }

  get isDirty(): boolean {
    return this.showDirtyIndicator && !!this.control?.dirty;
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
