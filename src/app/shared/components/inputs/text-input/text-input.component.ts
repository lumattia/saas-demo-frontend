import { Component, Input } from '@angular/core';
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
  @Input() control: FormControl = new FormControl('');
  @Input() type = 'text';
  @Input() required = false;
  @Input() disabled = false;
  @Input() maxLength?: number;
  @Input() errorKey = '';
  @Input() showDirtyIndicator = false;

  get isDirty(): boolean {
    return this.showDirtyIndicator && this.control.dirty;
  }
}
