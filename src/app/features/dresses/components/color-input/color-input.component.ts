import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-color-input',
  standalone: true,
  imports: [FormsModule],
  template: `
    <label>
      Color
      <input type="color" [(ngModel)]="color" (ngModelChange)="colorChange.emit($event)" />
    </label>
  `,
})
export class ColorInputComponent {
  @Input() color = '#000000';
  @Output() colorChange = new EventEmitter<string>();
}
