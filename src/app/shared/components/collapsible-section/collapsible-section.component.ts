import { Component, Input, Output, EventEmitter, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { ButtonComponent } from '../button/button.component';

@Component({
  selector: 'app-collapsible-section',
  standalone: true,
  imports: [CommonModule, TranslateModule, ButtonComponent],
  templateUrl: './collapsible-section.component.html',
  styleUrls: ['./collapsible-section.component.css']
})
export class CollapsibleSectionComponent {
  @Input() titleKey = '';
  @Input() showActions = true;
  @Input() isEditMode = true;
  @Input() isValid = true;

  @Output() save = new EventEmitter<void>();
  @Output() cancel = new EventEmitter<void>();
  @Output() edit = new EventEmitter<void>();

  isCollapsed = signal(false);

  toggleCollapse(): void {
    this.isCollapsed.update(value => !value);
  }

  onSave(): void {
    this.save.emit();
  }

  onCancel(): void {
    this.cancel.emit();
  }

  onEdit(): void {
    this.edit.emit();
  }
}
