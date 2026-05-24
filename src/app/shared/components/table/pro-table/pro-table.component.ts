import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { IdName, PaginationState, SortState } from '../../../../core/models/common.models';
import { DateTimePipe } from '../../../pipes/date-time.pipe';
import { SelectInputComponent } from '../../inputs/select-input/select-input.component';
import { ButtonComponent } from "../../button/button.component";

export interface TableColumn {
  key: string;
  labelKey: string;
  type?: string; // 'color' | 'date'
  pipe?: string | null;
}

@Component({
  selector: 'app-pro-table',
  standalone: true,
  imports: [CommonModule, TranslateModule, SelectInputComponent, ButtonComponent],
  templateUrl: './pro-table.component.html',
  styleUrls: ['./pro-table.component.css'],
})
export class ProTableComponent {
  @Input() columns: TableColumn[] = [];
  @Input() data: any[] = [];
  @Input() sortOptions: IdName[] = [];
  @Input() pagination: PaginationState = { pageSize: 10, pageNumber: 1, totalItems: 0 };
  @Input() filtersCollapsed = true;
  @Input() showActions = true;
  @Input() rowClickable = true;
  @Input() showDirtyIndicator = false;
  @Input() filterForm?: FormGroup;

  @Output() sortChange = new EventEmitter<SortState>();
  @Output() paginationChange = new EventEmitter<PaginationState>();
  @Output() rowClick = new EventEmitter<any>();
  @Output() editClick = new EventEmitter<any>();
  @Output() deleteClick = new EventEmitter<any>();
  @Output() filterApply = new EventEmitter<void>();

  currentSort: SortState = { field: '', direction: 'asc' };
  private dateTimePipe = new DateTimePipe();

  onSortChange(field: string): void {
    if (this.currentSort.field === field) {
      this.currentSort.direction = this.currentSort.direction === 'asc' ? 'desc' : 'asc';
    } else {
      this.currentSort.field = field;
      this.currentSort.direction = 'asc';
    }
    this.sortChange.emit(this.currentSort);
  }

  onPageSizeChange(event: Event): void {
    const input = event.target as HTMLInputElement;
    const newPageSize = parseInt(input.value, 10);
    if (newPageSize > 0 && newPageSize <= 100) {
      this.paginationChange.emit({ ...this.pagination, pageSize: newPageSize, pageNumber: 1 });
    }
  }

  onPageNumberChange(event: Event): void {
    const input = event.target as HTMLInputElement;
    const newPageNumber = parseInt(input.value, 10);
    const maxPage = Math.ceil(this.pagination.totalItems / this.pagination.pageSize);
    if (newPageNumber > 0 && newPageNumber <= maxPage) {
      this.paginationChange.emit({ ...this.pagination, pageNumber: newPageNumber - 1 });
    }
  }

  goToFirstPage(): void {
    this.paginationChange.emit({ ...this.pagination, pageNumber: 0 });
  }

  goToPreviousPage(): void {
    if (this.pagination.pageNumber > 0) {
      this.paginationChange.emit({ ...this.pagination, pageNumber: this.pagination.pageNumber - 1 });
    }
  }

  goToNextPage(): void {
    const maxPage = Math.ceil(this.pagination.totalItems / this.pagination.pageSize);
    if (this.pagination.pageNumber < maxPage - 1) {
      this.paginationChange.emit({ ...this.pagination, pageNumber: this.pagination.pageNumber + 1 });
    }
  }

  goToLastPage(): void {
    const maxPage = Math.ceil(this.pagination.totalItems / this.pagination.pageSize);
    this.paginationChange.emit({ ...this.pagination, pageNumber: maxPage - 1 });
  }

  toggleFilters(): void {
    this.filtersCollapsed = !this.filtersCollapsed;
  }

  onFilterApply(): void {
    // Reset dirty state on form
    if (this.filterForm) {
      this.filterForm.markAsPristine();
    }
    this.filterApply.emit();
  }

  onRowClick(row: any): void {
    if (this.rowClickable) {
      this.rowClick.emit(row);
    }
  }

  onEditClick(row: any, event: Event): void {
    event.stopPropagation();
    this.editClick.emit(row);
  }

  onDeleteClick(row: any, event: Event): void {
    event.stopPropagation();
    this.deleteClick.emit(row);
  }

  get totalPages(): number {
    return Math.ceil(this.pagination.totalItems / this.pagination.pageSize);
  }

  get canGoPrevious(): boolean {
    return this.pagination.pageNumber > 0;
  }

  get canGoNext(): boolean {
    return this.pagination.pageNumber < this.totalPages - 1;
  }

  get canGoFirst(): boolean {
    return this.pagination.pageNumber > 0;
  }

  get canGoLast(): boolean {
    return this.pagination.pageNumber < this.totalPages - 1;
  }

  getNestedValue(row: any, key: string): any {
    return key.split('.').reduce((obj, prop) => obj?.[prop], row);
  }

  transformValue(value: any, column: any): any {
    if (column.type === 'date') {
      const format = column.pipe || 'date';
      return this.dateTimePipe.transform(value, format as 'date' | 'datetime' | 'time');
    }
    return value;
  }
}
