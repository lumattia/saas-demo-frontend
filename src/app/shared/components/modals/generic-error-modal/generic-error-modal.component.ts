import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ButtonComponent } from '../../button/button.component';

export interface ErrorModalConfig {
  title: string;
  messages: string[];
  type?: 'error' | 'warning' | 'info';
}

@Component({
  selector: 'app-generic-error-modal',
  standalone: true,
  imports: [CommonModule, ButtonComponent],
  templateUrl: './generic-error-modal.component.html',
  styleUrls: ['./generic-error-modal.component.css']
})
export class GenericErrorModalComponent {
  show = signal(false);
  config = signal<ErrorModalConfig | null>(null);
  
  // These will be injected by ModalService
  close?: (result?: any) => void;
  dismiss?: (reason?: any) => void;

  open(config: ErrorModalConfig): void {
    this.config.set(config);
    this.show.set(true);
  }

  onConfirm(): void {
    this.close?.();
  }
}
