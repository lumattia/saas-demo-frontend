import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-color-input',
  standalone: true,
  imports: [CommonModule, FormsModule, TranslateModule],
  templateUrl: './color-input.component.html',
  styleUrls: ['./color-input.component.css'],
})
export class ColorInputComponent {
  @Input() labelKey = '';
  @Input() color = '#000000';
  @Input() errorKey = '';
  @Output() colorChange = new EventEmitter<string>();

  private hexColorRegex = /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/;

  onColorChange(event: Event): void {
    const input = event.target as HTMLInputElement;
    const value = input.value;
    
    if (this.hexColorRegex.test(value)) {
      this.colorChange.emit(value);
    }
  }

  get isValid(): boolean {
    return this.hexColorRegex.test(this.color);
  }
}
