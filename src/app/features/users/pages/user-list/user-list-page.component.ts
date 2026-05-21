import { Component, inject, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, Router } from '@angular/router';
import { ReactiveFormsModule, FormGroup, FormControl } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { UserService } from '../../../../core/services/user.service';
import { User, UserFilter } from '../../../../core/models/user.model';
import { ProTableComponent } from '../../../../shared/components/table/pro-table/pro-table.component';
import { TextInputComponent } from '../../../../shared/components/inputs/text-input/text-input.component';
import { IdName, PaginationState, SortState } from '../../../../core/models/common.models';

@Component({
  selector: 'app-user-list-page',
  standalone: true,
  imports: [CommonModule, RouterLink, TranslateModule, ReactiveFormsModule, ProTableComponent, TextInputComponent],
  templateUrl: './user-list-page.component.html',
  styleUrls: ['./user-list-page.component.css'],
})
export class UserListPageComponent implements OnInit {
  private userService = inject(UserService);
  private router = inject(Router);

  users = signal<User[]>([]);
  filter: UserFilter = { username: '', role: undefined };
  filterForm = new FormGroup({
    username: new FormControl('')
  });
  sort = signal<string>('id');

  get usernameControl(): FormControl {
    return this.filterForm.controls['username'] as FormControl;
  }
  order = signal<'asc' | 'desc'>('asc');
  pageNumber = signal<number>(0);
  pageSize = signal<number>(10);
  totalItems = signal<number>(0);

  columns = [
    { key: 'username', labelKey: 'users.list.columns.username' },
    { key: 'role', labelKey: 'users.list.columns.role' },
    { key: 'tenant', labelKey: 'users.list.columns.tenant' },
  ];

  sortOptions: IdName[] = [
    { id: 'username', name: 'users.list.sort.username' },
    { id: 'role', name: 'users.list.sort.role' },
  ];

  ngOnInit() {
    this.loadUsers();
  }

  loadUsers() {
    this.filter.username = this.filterForm.value.username || '';
    this.userService.getAll(this.filter, this.pageNumber(), this.pageSize(), this.sort(), this.order()).subscribe(data => {
      this.users.set(data.content);
      this.totalItems.set(data.totalElements);
      this.pageNumber.set(data.number);
    });
  }

  onSortChange(sortState: SortState) {
    this.sort.set(sortState.field);
    this.order.set(sortState.direction);
    this.loadUsers();
  }

  onPaginationChange(pagination: PaginationState) {
    this.pageNumber.set(pagination.pageNumber);
    this.pageSize.set(pagination.pageSize);
    this.loadUsers();
  }

  onFilterChange() {
    this.pageNumber.set(1);
    this.loadUsers();
  }

  deleteUser(id: number) {
    if (confirm('Are you sure you want to delete this user?')) {
      this.userService.delete(id).subscribe(() => {
        this.loadUsers();
      });
    }
  }

  onRowClick(user: User): void {
    this.router.navigate(['/users', user.id]);
  }

  onEditClick(user: User): void {
    this.router.navigate(['/users', user.id]);
  }
}
