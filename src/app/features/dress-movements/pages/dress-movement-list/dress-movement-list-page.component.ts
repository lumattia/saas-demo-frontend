import { Component, inject, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, Router } from '@angular/router';
import { ReactiveFormsModule, FormGroup, FormControl } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { DressMovementService } from '../../../../core/services/dress-movement.service';
import { DressMovement, DressMovementFilter } from '../../../../core/models/dress-movement.model';
import { ProTableComponent } from '../../../../shared/components/table/pro-table/pro-table.component';
import { TextInputComponent } from '../../../../shared/components/inputs/text-input/text-input.component';
import { IdName, PaginationState, SortState } from '../../../../core/models/common.models';

@Component({
  selector: 'app-dress-movement-list-page',
  standalone: true,
  imports: [CommonModule, RouterLink, TranslateModule, ReactiveFormsModule, ProTableComponent, TextInputComponent],
  templateUrl: './dress-movement-list-page.component.html',
  styleUrls: ['./dress-movement-list-page.component.css'],
})
export class DressMovementListPageComponent implements OnInit {
  private dressMovementService = inject(DressMovementService);
  private router = inject(Router);

  inventory = signal<DressMovement[]>([]);
  filter: DressMovementFilter = { dressTitle: '', sku: '', color: '', size: '', minQuantity: undefined, maxQuantity: undefined };
  filterForm = new FormGroup({
    dressTitle: new FormControl(''),
    sku: new FormControl(''),
    color: new FormControl(''),
    size: new FormControl(''),
    minQuantity: new FormControl(''),
    maxQuantity: new FormControl('')
  });
  sort = signal<string>('id');

  get dressTitleControl(): FormControl {
    return this.filterForm.controls['dressTitle'] as FormControl;
  }

  get skuControl(): FormControl {
    return this.filterForm.controls['sku'] as FormControl;
  }

  get colorControl(): FormControl {
    return this.filterForm.controls['color'] as FormControl;
  }

  get sizeControl(): FormControl {
    return this.filterForm.controls['size'] as FormControl;
  }

  get minQuantityControl(): FormControl {
    return this.filterForm.controls['minQuantity'] as FormControl;
  }

  get maxQuantityControl(): FormControl {
    return this.filterForm.controls['maxQuantity'] as FormControl;
  }
  order = signal<'asc' | 'desc'>('asc');
  pageNumber = signal<number>(0);
  pageSize = signal<number>(10);
  totalItems = signal<number>(0);

  columns = [
    { key: 'dress.sku', labelKey: 'inventory.list.columns.sku' },
    { key: 'dress.title', labelKey: 'inventory.list.columns.title' },
    { key: 'dress.size', labelKey: 'inventory.list.columns.size' },
    { key: 'dress.color', labelKey: 'inventory.list.columns.color', type: 'color' },
    { key: 'quantity', labelKey: 'inventory.list.columns.quantity' },
    { key: 'instant', labelKey: 'inventory.list.columns.date', type: 'date' },
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
    this.filter.dressTitle = this.filterForm.value.dressTitle || '';
    this.filter.sku = this.filterForm.value.sku || '';
    this.filter.color = this.filterForm.value.color || '';
    this.filter.size = this.filterForm.value.size || '';
    this.filter.minQuantity = this.filterForm.value.minQuantity ? Number(this.filterForm.value.minQuantity) : undefined;
    this.filter.maxQuantity = this.filterForm.value.maxQuantity ? Number(this.filterForm.value.maxQuantity) : undefined;
    this.dressMovementService.getAll(this.filter, this.pageNumber(), this.pageSize(), this.sort(), this.order()).subscribe(data => {
      this.inventory.set(data.content);
      this.totalItems.set(data.totalElements);
      this.pageNumber.set(data.number);
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
    this.pageNumber.set(0);
    this.loadInventory();
  }

  deleteItem(id: number) {
    if (confirm('Are you sure you want to delete this record?')) {
      this.dressMovementService.delete(id).subscribe(() => {
        this.loadInventory();
      });
    }
  }

  onRowClick(item: DressMovement): void {
    this.router.navigate(['/dress-movements', item.id]);
  }

  onEditClick(item: DressMovement): void {
    this.router.navigate(['/dress-movements', item.id]);
  }
}
