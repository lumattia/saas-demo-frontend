import { CommonModule } from '@angular/common';
import { Component, inject, signal, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { DressService } from '../../../../core/services/dress.service';
import { Dress } from '../../../../core/models/dress.model';

@Component({
  selector: 'app-dress-form-page',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    TranslateModule,
  ],
  template: `
    <main>
      <h1>{{ (id ? 'dresses.edit' : 'dresses.new') | translate }}</h1>

      <form (ngSubmit)="save()">
        <div class="form-group">
          <label>Título</label>
          <input name="title" [(ngModel)]="dress.title" required placeholder="Nombre vestido" />
        </div>
        <div class="form-group">
          <label>SKU</label>
          <input name="sku" [(ngModel)]="dress.sku" required placeholder="SKU" />
        </div>
        <div class="form-group">
          <label>Talla</label>
          <input name="size" [(ngModel)]="dress.size" placeholder="Talla" />
        </div>
        <div class="form-group">
          <label>Color</label>
          <input name="color" [(ngModel)]="dress.color" placeholder="Color" />
        </div>
        <div class="form-group">
          <label>Precio</label>
          <input name="price" type="number" [(ngModel)]="dress.price" placeholder="Precio" />
        </div>

        <div class="actions">
          <button type="submit" class="btn btn-primary">Guardar</button>
          @if (id) {
            <button type="button" class="btn btn-danger" (click)="delete()">Eliminar</button>
          }
          <button type="button" class="btn" (click)="exit()">Cancelar</button>
        </div>
      </form>
    </main>
  `,
  styles: [`
    .form-group { margin-bottom: 1rem; display: flex; flex-direction: column; }
    .form-group label { margin-bottom: 0.5rem; font-weight: bold; }
    .form-group input { padding: 8px; border: 1px solid #ccc; border-radius: 4px; }
    .actions { display: flex; gap: 1rem; margin-top: 1rem; }
    .btn { padding: 8px 16px; border-radius: 4px; cursor: pointer; border: 1px solid #ccc; }
    .btn-primary { background-color: #007bff; color: white; border: none; }
    .btn-danger { background-color: #dc3545; color: white; border: none; }
  `]
})
export class DressFormPageComponent implements OnInit {
  private dressService = inject(DressService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);

  id: number | null = null;
  dress: Partial<Dress> = { title: '', sku: '', size: '', color: '', price: 0 };

  ngOnInit() {
    const idParam = this.route.snapshot.paramMap.get('id');
    if (idParam && idParam !== 'new') {
      this.id = +idParam;
      this.dressService.getById(this.id).subscribe(data => {
        this.dress = data;
      });
    }
  }

  save(): void {
    if (this.id) {
      this.dressService.update(this.id, this.dress).subscribe(() => {
        this.router.navigate(['/dresses']);
      });
    } else {
      this.dressService.create(this.dress).subscribe(() => {
        this.router.navigate(['/dresses']);
      });
    }
  }

  delete(): void {
    if (this.id && confirm('¿Estás seguro?')) {
      this.dressService.delete(this.id).subscribe(() => {
        this.router.navigate(['/dresses']);
      });
    }
  }

  exit(): void {
      this.router.navigate(['/dresses']);
    }
  }
