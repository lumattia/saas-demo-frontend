import { Component, Input, Output, EventEmitter } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
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
