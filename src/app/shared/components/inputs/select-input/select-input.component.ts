import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { IdName } from '../../../../core/models/common.models';


@Component({
  selector: 'app-select-input',
  standalone: true,
  imports: [CommonModule, FormsModule, TranslateModule],
  templateUrl: './select-input.component.html',
  styleUrls: ['./select-input.component.css'],
})
export class SelectInputComponent {
  @Input() labelKey = '';
  @Input() placeholderKey = '';
  @Input() value:string|number = '';
  @Input() options: IdName[] = [];
  @Input() required = false;
  @Input() disabled = false;
  @Input() errorKey = '';
  @Output() valueChange = new EventEmitter<string|number>();

  onValueChange(event: Event): void {
    const select = event.target as HTMLSelectElement;
    this.valueChange.emit(select.value);
  }
}
