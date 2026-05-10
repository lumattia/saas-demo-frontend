import { Component, inject, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { InventoryService } from '../../../../core/services/inventory.service';
import { DressService } from '../../../../core/services/dress.service';
import { Inventory } from '../../../../core/models/inventory.model';
import { Dress } from '../../../../core/models/dress.model';

@Component({
  selector: 'app-inventory-form-page',
  standalone: true,
  imports: [CommonModule, FormsModule, TranslateModule],
  template: `
    <main>
      <h1>{{ (id ? 'inventory.detail' : 'inventory.new') | translate }}</h1>

      <form (ngSubmit)="save()">
        <div class="form-group">
          <label>Vestido</label>
          <select name="dressId" [(ngModel)]="item.dressId" required [disabled]="!!id">
            <option value="">Seleccionar vestido</option>
            @for (dress of dresses(); track dress.id) {
              <option [value]="dress.id">{{ dress.title }} ({{ dress.sku }})</option>
            }
          </select>
        </div>
        <div class="form-group">
          <label>Cantidad</label>
          <input name="quantity" type="number" [(ngModel)]="item.quantity" required placeholder="Cantidad" />
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
    .form-group input, .form-group select { padding: 8px; border: 1px solid #ccc; border-radius: 4px; }
    .actions { display: flex; gap: 1rem; margin-top: 1rem; }
    .btn { padding: 8px 16px; border-radius: 4px; cursor: pointer; border: 1px solid #ccc; }
    .btn-primary { background-color: #007bff; color: white; border: none; }
    .btn-danger { background-color: #dc3545; color: white; border: none; }
  `]
})
export class InventoryFormPageComponent implements OnInit {
  private inventoryService = inject(InventoryService);
  private dressService = inject(DressService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);

  id: number | null = null;
  item: Partial<Inventory> = { dressId: 0, quantity: 0 };
  dresses = signal<Dress[]>([]);

  ngOnInit() {
    this.dressService.getAll().subscribe(data => this.dresses.set(data));

    const idParam = this.route.snapshot.paramMap.get('id');
    if (idParam && idParam !== 'new') {
      this.id = +idParam;
      this.inventoryService.getById(this.id).subscribe(data => {
        this.item = data;
      });
    }
  }

  save(): void {
    if (this.id) {
      this.inventoryService.update(this.id, this.item).subscribe(() => {
        this.router.navigate(['/inventory']);
      });
    } else {
      this.inventoryService.create(this.item).subscribe(() => {
        this.router.navigate(['/inventory']);
      });
    }
  }

  delete(): void {
    if (this.id && confirm('¿Estás seguro?')) {
      this.inventoryService.delete(this.id).subscribe(() => {
        this.router.navigate(['/inventory']);
      });
    }
  }

  exit(): void {
    this.router.navigate(['/inventory']);
  }
}
