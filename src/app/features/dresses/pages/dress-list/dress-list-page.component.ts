import { Component, inject, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, Router } from '@angular/router';
import { ReactiveFormsModule, FormGroup, FormControl } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { DressService } from '../../../../core/services/dress.service';
import { Dress, DressFilter } from '../../../../core/models/dress.model';
import { ProTableComponent } from '../../../../shared/components/table/pro-table/pro-table.component';
import { TextInputComponent } from '../../../../shared/components/inputs/text-input/text-input.component';
import { ColorInputComponent } from '../../../../shared/components/inputs/color-input/color-input.component';
import { NumberInputComponent } from '../../../../shared/components/inputs/number-input/number-input.component';
import { IdName, PaginationState, SortState } from '../../../../core/models/common.models';

@Component({
  selector: 'app-dress-list-page',
  standalone: true,
  imports: [CommonModule, RouterLink, TranslateModule, ReactiveFormsModule, ProTableComponent, TextInputComponent, ColorInputComponent, NumberInputComponent],
  templateUrl: './dress-list-page.component.html',
  styleUrls: ['./dress-list-page.component.css'],
})
export class DressListPageComponent implements OnInit {
  private dressService = inject(DressService);
  private router = inject(Router);

  dresses = signal<Dress[]>([]);
  filter: DressFilter = { title: '', sku: '', size: '', color: '', minStock: undefined, maxStock: undefined, minPrice: undefined, maxPrice: undefined };
  filterForm = new FormGroup({
    title: new FormControl(''),
    sku: new FormControl(''),
    size: new FormControl(''),
    color: new FormControl(''),
    minStock: new FormControl(''),
    maxStock: new FormControl(''),
    minPrice: new FormControl(''),
    maxPrice: new FormControl('')
  });
  sort = signal<string>('id');

  get titleControl(): FormControl {
    return this.filterForm.controls['title'] as FormControl;
  }

  get skuControl(): FormControl {
    return this.filterForm.controls['sku'] as FormControl;
  }

  get sizeControl(): FormControl {
    return this.filterForm.controls['size'] as FormControl;
  }

  get colorControl(): FormControl {
    return this.filterForm.controls['color'] as FormControl;
  }

  get minStockControl(): FormControl {
    return this.filterForm.controls['minStock'] as FormControl;
  }

  get maxStockControl(): FormControl {
    return this.filterForm.controls['maxStock'] as FormControl;
  }

  get minPriceControl(): FormControl {
    return this.filterForm.controls['minPrice'] as FormControl;
  }

  get maxPriceControl(): FormControl {
    return this.filterForm.controls['maxPrice'] as FormControl;
  }
  order = signal<'asc' | 'desc'>('asc');
  pageNumber = signal<number>(0);
  pageSize = signal<number>(10);
  totalItems = signal<number>(0);

  columns = [
    { key: 'title', labelKey: 'dresses.list.columns.title' },
    { key: 'sku', labelKey: 'dresses.list.columns.sku' },
    { key: 'size', labelKey: 'dresses.list.columns.size' },
    { key: 'color', labelKey: 'dresses.list.columns.color', isColor: true },
    { key: 'stock', labelKey: 'dresses.list.columns.stock' },
    { key: 'price', labelKey: 'dresses.list.columns.price' },
  ];

  sortOptions: IdName[] = [
    { id: 'title', name: 'dresses.list.sort.title' },
    { id: 'sku', name: 'dresses.list.sort.sku' },
    { id: 'size', name: 'dresses.list.sort.size' },
    { id: 'stock', name: 'dresses.list.sort.stock' },
    { id: 'price', name: 'dresses.list.sort.price' },
  ];

  ngOnInit() {
    this.loadDresses();
  }

  loadDresses() {
    this.filter.title = this.filterForm.value.title || '';
    this.filter.sku = this.filterForm.value.sku || '';
    this.filter.size = this.filterForm.value.size || '';
    this.filter.color = this.filterForm.value.color || '';
    this.filter.minStock = this.filterForm.value.minStock ? Number(this.filterForm.value.minStock) : undefined;
    this.filter.maxStock = this.filterForm.value.maxStock ? Number(this.filterForm.value.maxStock) : undefined;
    this.filter.minPrice = this.filterForm.value.minPrice ? Number(this.filterForm.value.minPrice) : undefined;
    this.filter.maxPrice = this.filterForm.value.maxPrice ? Number(this.filterForm.value.maxPrice) : undefined;
    this.dressService.getAll(this.filter, this.pageNumber(), this.pageSize(), this.sort(), this.order()).subscribe(data => {
      this.dresses.set(data.content);
      this.totalItems.set(data.totalElements);
      this.pageNumber.set(data.number);
    });
  }

  onSortChange(sortState: SortState) {
    this.sort.set(sortState.field);
    this.order.set(sortState.direction);
    this.loadDresses();
  }

  onPaginationChange(pagination: PaginationState) {
    this.pageNumber.set(pagination.pageNumber);
    this.pageSize.set(pagination.pageSize);
    this.loadDresses();
  }

  onFilterChange() {
    this.pageNumber.set(1);
    this.loadDresses();
  }

  deleteDress(id: number) {
    if (confirm('Are you sure you want to delete this dress?')) {
      this.dressService.delete(id).subscribe(() => {
        this.loadDresses();
      });
    }
  }

  onRowClick(dress: Dress): void {
    this.router.navigate(['/dresses', dress.id]);
  }

  onEditClick(dress: Dress): void {
    this.router.navigate(['/dresses', dress.id]);
  }
}
