import { Component, inject, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { ReactiveFormsModule, FormGroup, FormControl } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { DressMovementService } from '../../../../core/services/dress-movement.service';
import { DressMovement, DressMovementFilter } from '../../../../core/models/dress-movement.model';
import { ProTableComponent } from '../../../../shared/components/table/pro-table/pro-table.component';
import { TextInputComponent } from '../../../../shared/components/inputs/text-input/text-input.component';
import { IdName, PaginationState, SortState } from '../../../../core/models/common.models';
import { ModalService } from '../../../../shared/services/modal.service';
import { ConfirmModalComponent } from '../../../../shared/components/modals/confirm-modal/confirm-modal.component';

@Component({
  selector: 'app-dress-movement-list-page',
  standalone: true,
  imports: [CommonModule, TranslateModule, ReactiveFormsModule, ProTableComponent, TextInputComponent],
  templateUrl: './dress-movement-list-page.component.html',
  styleUrls: ['./dress-movement-list-page.component.css'],
})
export class DressMovementListPageComponent implements OnInit {
  private dressMovementService = inject(DressMovementService);
  private router = inject(Router);
  private modalService = inject(ModalService);

  dressMovement = signal<DressMovement[]>([]);
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
    { key: 'dress.sku', labelKey: 'dress-movements.list.columns.sku' },
    { key: 'dress.title', labelKey: 'dress-movements.list.columns.title' },
    { key: 'dress.size', labelKey: 'dress-movements.list.columns.size' },
    { key: 'dress.color', labelKey: 'dress-movements.list.columns.color', type: 'color' },
    { key: 'quantity', labelKey: 'dress-movements.list.columns.quantity' },
    { key: 'instant', labelKey: 'dress-movements.list.columns.date', type: 'date' },
  ];

  sortOptions: IdName[] = [
    { id: 'dress.sku', name: 'dress-movements.list.sort.sku' },
    { id: 'quantity', name: 'dress-movements.list.sort.quantity' },
    { id: 'instant', name: 'dress-movements.list.sort.date' },
  ];

  ngOnInit() {
    this.loadDressMovement();
  }

  loadDressMovement() {
    this.filter.dressTitle = this.filterForm.value.dressTitle || '';
    this.filter.sku = this.filterForm.value.sku || '';
    this.filter.color = this.filterForm.value.color || '';
    this.filter.size = this.filterForm.value.size || '';
    this.filter.minQuantity = this.filterForm.value.minQuantity ? Number(this.filterForm.value.minQuantity) : undefined;
    this.filter.maxQuantity = this.filterForm.value.maxQuantity ? Number(this.filterForm.value.maxQuantity) : undefined;
    this.dressMovementService.getAll(this.filter, this.pageNumber(), this.pageSize(), this.sort(), this.order()).subscribe(data => {
      this.dressMovement.set(data.content);
      this.totalItems.set(data.totalElements);
      this.pageNumber.set(data.number);
    });
  }

  onSortChange(sortState: SortState) {
    this.sort.set(sortState.field);
    this.order.set(sortState.direction);
    this.loadDressMovement();
  }

  onPaginationChange(pagination: PaginationState) {
    this.pageNumber.set(pagination.pageNumber);
    this.pageSize.set(pagination.pageSize);
    this.loadDressMovement();
  }

  onFilterChange() {
    this.pageNumber.set(0);
    this.loadDressMovement();
  }

  deleteItem(id: number) {
    const modalRef = this.modalService.open(ConfirmModalComponent, {
      open: true,
      title: 'dress-movements.form.delete',
      message: 'dress-movements.form.deleteConfirm'
    });
    modalRef.result.then((confirmed) => {
      if (confirmed) {
        this.dressMovementService.delete(id).subscribe(() => this.loadDressMovement());
      }
    })
  }

  onRowClick(item: DressMovement): void {
    this.router.navigate(['/dress-movements', item.id]);
  }

  onEditClick(item: DressMovement): void {
    this.router.navigate(['/dress-movements', item.id], { queryParams: { edit: true } });
  }
}
