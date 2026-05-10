import { Component, inject, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { DressService } from '../../../../core/services/dress.service';
import { Dress, DressFilter } from '../../../../core/models/dress.model';

@Component({
  selector: 'app-dress-list-page',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule, TranslateModule],
  template: `
    <div class="header">
      <h1>{{ 'dresses.list.title' | translate }}</h1>
      <button class="btn btn-primary" routerLink="/dresses/new">Nuevo Vestido</button>
    </div>

    <div class="filters">
      <input [(ngModel)]="filter.title" (ngModelChange)="loadDresses()" placeholder="Filtrar por nombre" />
      <input [(ngModel)]="filter.sku" (ngModelChange)="loadDresses()" placeholder="Filtrar por SKU" />
      <select [(ngModel)]="filter.color" (ngModelChange)="loadDresses()">
        <option value="">Todos los colores</option>
        <option value="Rojo">Rojo</option>
        <option value="Azul">Azul</option>
        <option value="Verde">Verde</option>
        <option value="Negro">Negro</option>
      </select>
    </div>

    <table class="table">
      <thead>
        <tr>
          <th (click)="toggleSort('title')">Título</th>
          <th (click)="toggleSort('sku')">SKU</th>
          <th (click)="toggleSort('size')">Talla</th>
          <th (click)="toggleSort('color')">Color</th>
          <th (click)="toggleSort('stock')">Stock</th>
          <th (click)="toggleSort('price')">Precio</th>
          <th>Acciones</th>
        </tr>
      </thead>
      <tbody>
        @for (dress of dresses(); track dress.id) {
          <tr>
            <td>{{ dress.title }}</td>
            <td>{{ dress.sku }}</td>
            <td>{{ dress.size }}</td>
            <td>{{ dress.color }}</td>
            <td>{{ dress.stock }}</td>
            <td>{{ dress.price | currency:'EUR' }}</td>
            <td>
              <a [routerLink]="['/dresses', dress.id]">Editar</a>
              <button (click)="deleteDress(dress.id)">Eliminar</button>
            </td>
          </tr>
        } @empty {
          <tr>
            <td colspan="7">No se encontraron vestidos.</td>
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
export class DressListPageComponent implements OnInit {
  private dressService = inject(DressService);
  
  dresses = signal<Dress[]>([]);
  filter: DressFilter = { title: '', sku: '', color: '' };
  sort = signal<string>('id');
  order = signal<'asc' | 'desc'>('asc');

  ngOnInit() {
    this.loadDresses();
  }

  loadDresses() {
    this.dressService.getAll(this.filter, this.sort(), this.order()).subscribe(data => {
      this.dresses.set(data);
    });
  }

  toggleSort(column: string) {
    if (this.sort() === column) {
      this.order.set(this.order() === 'asc' ? 'desc' : 'asc');
    } else {
      this.sort.set(column);
      this.order.set('asc');
    }
    this.loadDresses();
  }

  deleteDress(id: number) {
    if (confirm('¿Estás seguro de que quieres eliminar este vestido?')) {
      this.dressService.delete(id).subscribe(() => {
        this.loadDresses();
      });
    }
  }
}
