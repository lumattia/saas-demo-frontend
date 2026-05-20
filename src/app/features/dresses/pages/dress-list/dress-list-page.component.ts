import { Component, inject, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, Router } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { DressService } from '../../../../core/services/dress.service';
import { Dress, DressFilter } from '../../../../core/models/dress.model';
import { ProTableComponent } from '../../../../shared/components/table/pro-table/pro-table.component';
import { TextInputComponent } from '../../../../shared/components/inputs/text-input/text-input.component';
import { IdName, PaginationState, SortState } from '../../../../core/models/common.models';

@Component({
  selector: 'app-dress-list-page',
  standalone: true,
  imports: [CommonModule, RouterLink, TranslateModule, ProTableComponent, TextInputComponent],
  templateUrl: './dress-list-page.component.html',
  styleUrls: ['./dress-list-page.component.css'],
})
export class DressListPageComponent implements OnInit {
  private dressService = inject(DressService);
  private router = inject(Router);

  dresses = signal<Dress[]>([]);
  filter: DressFilter = { title: '', sku: '', size: '' };
  sort = signal<string>('id');
  order = signal<'asc' | 'desc'>('asc');
  pageNumber = signal<number>(1);
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
    this.dressService.getAll(this.filter, this.pageNumber(), this.pageSize(), this.sort(), this.order()).subscribe(data => {
      this.dresses.set(data.content);
      this.totalItems.set(data.totalElements);
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
