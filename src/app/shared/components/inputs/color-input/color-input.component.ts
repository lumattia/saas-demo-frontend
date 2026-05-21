import { Component, Input } from '@angular/core';
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
  @Input() control: FormControl = new FormControl('#000000');
  @Input() errorKey = '';
  @Input() showDirtyIndicator = false;

  private hexColorRegex = /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/;

  get isValid(): boolean {
    return this.hexColorRegex.test(this.control.value || '');
  }

  get isDirty(): boolean {
    return this.showDirtyIndicator && this.control.dirty;
  }
}
