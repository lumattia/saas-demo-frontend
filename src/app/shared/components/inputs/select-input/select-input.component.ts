import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { IdName } from '../../../../core/models/common.models';


@Component({
  selector: 'app-select-input',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, TranslateModule],
  templateUrl: './select-input.component.html',
  styleUrls: ['./select-input.component.css'],
})
export class SelectInputComponent {
  @Input() labelKey = '';
  @Input() placeholderKey = '';
  @Input() control: FormControl = new FormControl('');
  @Input() options: IdName[] = [];
  @Input() required = false;
  @Input() disabled = false;
  @Input() errorKey = '';
  @Input() showDirtyIndicator = false;

  get isDirty(): boolean {
    return this.showDirtyIndicator && this.control.dirty;
  }
}
