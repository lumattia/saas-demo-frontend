import { Component, inject, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { InventoryService } from '../../../../core/services/inventory.service';
import { Inventory, InventoryFilter } from '../../../../core/models/inventory.model';
import { ProTableComponent } from '../../../../shared/components/table/pro-table/pro-table.component';
import { TextInputComponent } from '../../../../shared/components/inputs/text-input/text-input.component';
import { IdName, PaginationState, SortState } from '../../../../core/models/common.models';

@Component({
  selector: 'app-inventory-list-page',
  standalone: true,
  imports: [CommonModule, RouterLink, TranslateModule, ProTableComponent, TextInputComponent],
  templateUrl: './inventory-list-page.component.html',
  styleUrls: ['./inventory-list-page.component.css'],
})
export class InventoryListPageComponent implements OnInit {
  private inventoryService = inject(InventoryService);
  
  inventory = signal<Inventory[]>([]);
  filter: InventoryFilter = { dressTitle: '' };
  sort = signal<string>('id');
  order = signal<'asc' | 'desc'>('asc');
  pageNumber = signal<number>(1);
  pageSize = signal<number>(10);
  totalItems = signal<number>(0);

  columns = [
    { key: 'dress.sku', labelKey: 'inventory.list.columns.sku' },
    { key: 'dress.title', labelKey: 'inventory.list.columns.title' },
    { key: 'dress.size', labelKey: 'inventory.list.columns.size' },
    { key: 'dress.color', labelKey: 'inventory.list.columns.color', isColor: true },
    { key: 'quantity', labelKey: 'inventory.list.columns.quantity' },
    { key: 'instant', labelKey: 'inventory.list.columns.date' },
  ];

  sortOptions: IdName[] = [
    { id: 'dress.sku', name: 'inventory.list.sort.sku' },
    { id: 'quantity', name: 'inventory.list.sort.quantity' },
    { id: 'instant', name: 'inventory.list.sort.date' },
  ];

  ngOnInit() {
    this.loadInventory();
  }

  loadInventory() {
    this.inventoryService.getAll(this.filter, this.pageNumber(), this.pageSize(), this.sort(), this.order()).subscribe(data => {
      this.inventory.set(data.content);
      this.totalItems.set(data.totalElements);
    });
  }

  onSortChange(sortState: SortState) {
    this.sort.set(sortState.field);
    this.order.set(sortState.direction);
    this.loadInventory();
  }

  onPaginationChange(pagination: PaginationState) {
    this.pageNumber.set(pagination.pageNumber);
    this.pageSize.set(pagination.pageSize);
    this.loadInventory();
  }

  onFilterChange() {
    this.pageNumber.set(1);
    this.loadInventory();
  }

  deleteItem(id: number) {
    if (confirm('Are you sure you want to delete this record?')) {
      this.inventoryService.delete(id).subscribe(() => {
        this.loadInventory();
      });
    }
  }
}
