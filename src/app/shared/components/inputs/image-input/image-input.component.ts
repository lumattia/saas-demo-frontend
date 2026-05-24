import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-image-input',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <label>
      Imagen
      <input type="file" accept="image/*" (change)="onFileSelected($event)" />
    </label>
    <img *ngIf="preview" [src]="preview" alt="preview" width="180" />
  `,
})
export class ImageInputComponent {
  @Input() control: FormControl | null = null;
  @Input() value: string | null = null;
  @Output() fileReady = new EventEmitter<File>();
  @Output() valueChange = new EventEmitter<string>();

  preview = '';

  ngOnInit() {
    if (this.control) {
      this.preview = this.control.value || '';
    } else if (this.value) {
      this.preview = this.value;
    }
  }

  async onFileSelected(event: Event): Promise<void> {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];
    if (!file) return;
    const processed = await this.cropSquareAndCompress(file);
    this.preview = URL.createObjectURL(processed);
    this.fileReady.emit(processed);

    // Also emit the preview URL as value
    if (this.control) {
      this.control.setValue(this.preview);
    } else {
      this.valueChange.emit(this.preview);
    }
  }

  private cropSquareAndCompress(file: File): Promise<File> {
    return new Promise((resolve, reject) => {
      const img = new Image();
      const reader = new FileReader();
      reader.onload = () => {
        img.src = String(reader.result);
      };
      img.onload = () => {
        const size = Math.min(img.width, img.height);
        const sx = (img.width - size) / 2;
        const sy = (img.height - size) / 2;
        const canvas = document.createElement('canvas');
        canvas.width = 800;
        canvas.height = 800;
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          reject(new Error('No canvas context'));
          return;
        }
        ctx.drawImage(img, sx, sy, size, size, 0, 0, 800, 800);
        canvas.toBlob(
          (blob) => {
            if (!blob) {
              reject(new Error('Cannot create compressed image'));
              return;
            }
            resolve(new File([blob], file.name, { type: 'image/jpeg' }));
          },
          'image/jpeg',
          0.8,
        );
      };
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  }
}
