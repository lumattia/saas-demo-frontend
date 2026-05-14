import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-text-input',
  standalone: true,
  imports: [FormsModule, TranslateModule],
  templateUrl: './text-input.component.html',
  styleUrls: ['./text-input.component.css'],
})
export class TextInputComponent {
  @Input() labelKey = '';
  @Input() placeholderKey = '';
  @Input() value = '';
  @Input() type = 'text';
  @Input() required = false;
  @Input() disabled = false;
  @Input() maxLength?: number;
  @Input() errorKey = '';
  @Output() valueChange = new EventEmitter<string>();

  onValueChange(event: Event): void {
    const input = event.target as HTMLInputElement;
    this.valueChange.emit(input.value);
  }
}
