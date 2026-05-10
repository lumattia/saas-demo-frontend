import { Component, inject, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { InventoryService } from '../../../../core/services/inventory.service';
import { Inventory, InventoryFilter } from '../../../../core/models/inventory.model';

@Component({
  selector: 'app-inventory-list-page',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule, TranslateModule],
  template: `
    <div class="header">
      <h1>{{ 'inventory.list.title' | translate }}</h1>
      <button class="btn btn-primary" routerLink="/inventory/new">Registrar Movimiento</button>
    </div>

    <div class="filters">
      <input [(ngModel)]="filter.dressTitle" (ngModelChange)="loadInventory()" placeholder="Filtrar por vestido" />
    </div>

    <table class="table">
      <thead>
        <tr>
          <th (click)="toggleSort('dressTitle')">Vestido</th>
          <th (click)="toggleSort('quantity')">Cantidad</th>
          <th>Acciones</th>
        </tr>
      </thead>
      <tbody>
        @for (item of inventory(); track item.id) {
          <tr>
            <td>{{ item.dressTitle }}</td>
            <td>{{ item.quantity }}</td>
            <td>
              <a [routerLink]="['/inventory', item.id]">Detalle</a>
              <button (click)="deleteItem(item.id)">Eliminar</button>
            </td>
          </tr>
        } @empty {
          <tr>
            <td colspan="3">No se encontraron movimientos de inventario.</td>
          </tr>
        }
      </tbody>
    </table>
  `,
  styles: [`
    .header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 1rem; }
    .filters { display: flex; gap: 1rem; margin-bottom: 1rem; }
    .table { width: 100%; border-collapse: collapse; }
    .table th, .table td { border: 1px solid #ddd; padding: 8px; text-align: left; }
    .table th { cursor: pointer; background-color: #f4f4f4; }
    .table th:hover { background-color: #e4e4e4; }
    .btn { padding: 8px 16px; border-radius: 4px; cursor: pointer; }
    .btn-primary { background-color: #007bff; color: white; border: none; }
  `]
})
export class InventoryListPageComponent implements OnInit {
  private inventoryService = inject(InventoryService);
  
  inventory = signal<Inventory[]>([]);
  filter: InventoryFilter = { dressTitle: '' };
  sort = signal<string>('id');
  order = signal<'asc' | 'desc'>('asc');

  ngOnInit() {
    this.loadInventory();
  }

  loadInventory() {
    this.inventoryService.getAll(this.filter, this.sort(), this.order()).subscribe(data => {
      this.inventory.set(data);
    });
  }

  toggleSort(column: string) {
    if (this.sort() === column) {
      this.order.set(this.order() === 'asc' ? 'desc' : 'asc');
    } else {
      this.sort.set(column);
      this.order.set('asc');
    }
    this.loadInventory();
  }

  deleteItem(id: number) {
    if (confirm('¿Estás seguro de que quieres eliminar este registro?')) {
      this.inventoryService.delete(id).subscribe(() => {
        this.loadInventory();
      });
    }
  }
}
