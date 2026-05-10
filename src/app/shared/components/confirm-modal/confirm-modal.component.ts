import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-confirm-modal',
  standalone: true,
  imports: [CommonModule],
  template: `
    <section class="modal" *ngIf="open">
      <div class="dialog">
        <h3>{{ title }}</h3>
        <p>{{ message }}</p>
        <button type="button" (click)="cancel.emit()">Cancelar</button>
        <button type="button" class="danger" (click)="confirm.emit()">Eliminar</button>
      </div>
    </section>
  `,
})
export class ConfirmModalComponent {
  @Input() open = false;
  @Input() title = 'Confirmar';
  @Input() message = '¿Deseas continuar?';
  @Output() confirm = new EventEmitter<void>();
  @Output() cancel = new EventEmitter<void>();
}
