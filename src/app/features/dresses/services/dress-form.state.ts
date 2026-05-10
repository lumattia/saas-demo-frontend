import { Injectable, computed, signal } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class DressFormState {
  readonly name = signal('');
  readonly sku = signal('');
  readonly size = signal('');
  readonly color = signal('#000000');
  readonly image = signal<File | null>(null);
  readonly touched = signal(false);

  readonly canSubmit = computed(() => this.name().trim() !== '' && this.sku().trim() !== '');
}
