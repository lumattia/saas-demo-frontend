import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-unsaved-changes-modal',
  standalone: true,
  imports: [CommonModule],
  template: `
    <section class="modal" *ngIf="open">
      <div class="dialog">
        <h3>Cambios sin guardar</h3>
        <p>El formulario tiene cambios. ¿Quieres salir sin guardar?</p>
        <button type="button" (click)="stay.emit()">Permanecer</button>
        <button type="button" class="danger" (click)="leave.emit()">Salir</button>
      </div>
    </section>
  `,
})
export class UnsavedChangesModalComponent {
  @Input() open = false;
  @Output() stay = new EventEmitter<void>();
  @Output() leave = new EventEmitter<void>();
}
