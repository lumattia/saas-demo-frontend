import { Component, Input, Output, EventEmitter, signal, computed, HostListener, inject, ElementRef, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { IdName } from '../../../../core/models/common.models';


@Component({
  selector: 'app-select-input',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, TranslateModule],
  templateUrl: './select-input.component.html',
  styleUrls: ['./select-input.component.css'],
})
export class SelectInputComponent {
  @Input() labelKey = '';
  @Input() placeholderKey = '';
  @Input() control: FormControl | null = null;
  @Input() value: any = null;
  @Input() options: IdName[] = [];
  @Input() required = false;
  @Input() disabled = false;
  @Input() readonly = false;
  @Input() errorKey = '';
  @Input() showDirtyIndicator = false;
  @Input() showClearButton = true;

  @Output() valueChange = new EventEmitter<any>();

  elementRef = inject(ElementRef);

  isDropdownOpen = signal(false);
  searchTerm = signal('');

  get isDirty(): boolean {
    return this.showDirtyIndicator && !!this.control?.dirty;
  }

  get internalControl(): FormControl {
    return this.control || new FormControl(this.value);
  }

  get selectedOptionName(): string {
    const currentValue = this.internalControl.value;
    if (!currentValue) return '';
    const selectedOption = this.options.find(opt => opt.id == currentValue);
    return selectedOption ? selectedOption.name : '';
  }

  filteredOptions = computed(() => {
    const search = this.searchTerm().toLowerCase();
    if (!search) return this.options;
    return this.options.filter(opt =>
      opt.name.toLowerCase().includes(search)
    );
  });

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent) {
    if (!this.isDropdownOpen) return;
    const clickedInside = this.elementRef.nativeElement.contains(event.target);
    if (!clickedInside) {
    this.isDropdownOpen.set(false);
     this.searchTerm.set('');
    }
  }

  toggleDropdown(): void {
    if (!this.disabled && !this.readonly) {
      this.isDropdownOpen.update(open => !open);
      this.searchTerm.set('');
    }
  }

  closeDropdown(): void {
    this.isDropdownOpen.set(false);
  }

  selectOption(option: IdName): void {
    const newValue = option.id;
    if (this.control) {
      this.control.setValue(newValue);
    } else {
      this.valueChange.emit(newValue);
    }
    this.closeDropdown();
  }

  onSearchInput(event: Event): void {
    const input = event.target as HTMLInputElement;
    this.searchTerm.set(input.value);
  }

  clearSelection(event: MouseEvent): void {
    event.stopPropagation();
    if (this.control) {
      this.control.setValue(null);
    } else {
      this.valueChange.emit(null);
    }
  }

  get hasValue(): boolean {
    return !!this.internalControl.value;
  }
}
