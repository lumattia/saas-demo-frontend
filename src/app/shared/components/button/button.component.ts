import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

export type ButtonVariant = 'primary' | 'secondary' | 'danger' | 'success';
export type ButtonSize = 'sm' | 'md' | 'lg';

@Component({
  selector: 'app-button',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './button.component.html',
  styleUrls: ['./button.component.css'],
})
export class ButtonComponent {
  @Input() variant: ButtonVariant = 'primary';
  @Input() size: ButtonSize = 'md';
  @Input() disabled = false;
  @Input() type: 'button' | 'submit' | 'reset' = 'button';
  @Input() icon?: string;
  @Input() fullWidth = false;
  
  @Output() click = new EventEmitter<MouseEvent>();

  get classes(): string {
    return `button ${this.variant} ${this.size} ${this.fullWidth ? 'full-width' : ''}`;
  }

  onClick(event: MouseEvent): void {
    if (!this.disabled) {
      event.stopPropagation();
      this.click.emit(event);
    }
  }
}
