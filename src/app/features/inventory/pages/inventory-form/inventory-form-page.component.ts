import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormGroup, FormControl } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { InventoryService } from '../../../../core/services/inventory.service';
import { DressService } from '../../../../core/services/dress.service';
import { Inventory } from '../../../../core/models/inventory.model';
import { IdName } from '../../../../core/models/common.models';
import { SelectInputComponent } from '../../../../shared/components/inputs/select-input/select-input.component';
import { NumberInputComponent } from '../../../../shared/components/inputs/number-input/number-input.component';

@Component({
  selector: 'app-inventory-form-page',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, TranslateModule, SelectInputComponent, NumberInputComponent],
  templateUrl: './inventory-form-page.component.html',
  styleUrls: ['./inventory-form-page.component.css'],
})
export class InventoryFormPageComponent implements OnInit {
  private inventoryService = inject(InventoryService);
  private dressService = inject(DressService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);

  id: number | null = null;
  inventoryForm = new FormGroup({
    dressId: new FormControl(''),
    quantity: new FormControl('')
  });
  dresses: IdName[] = [];

  get dressIdControl(): FormControl {
    return this.inventoryForm.controls['dressId'] as FormControl;
  }

  get quantityControl(): FormControl {
    return this.inventoryForm.controls['quantity'] as FormControl;
  }

  ngOnInit() {
    this.dressService.list().subscribe(data => this.dresses = data);

    const idParam = this.route.snapshot.paramMap.get('id');
    if (idParam && idParam !== 'new') {
      this.id = +idParam;
      this.inventoryService.getById(this.id).subscribe(data => {
        this.inventoryForm.patchValue({
          dressId: data.dress.id.toString(),
          quantity: data.quantity.toString()
        });
      });
    }
  }

  save(): void {
    const formValue = this.inventoryForm.value;
    const item: Partial<Inventory> = {
      dressId: formValue.dressId ? Number(formValue.dressId) : 0,
      quantity: formValue.quantity ? Number(formValue.quantity) : 0
    };
    if (this.id) {
      this.inventoryService.update(this.id, item).subscribe(() => {
        this.router.navigate(['/inventory']);
      });
    } else {
      this.inventoryService.create(item).subscribe(() => {
        this.router.navigate(['/inventory']);
      });
    }
  }

  delete(): void {
    if (this.id && confirm('Are you sure you want to delete this record?')) {
      this.inventoryService.delete(this.id).subscribe(() => {
        this.router.navigate(['/inventory']);
      });
    }
  }

  exit(): void {
    this.router.navigate(['/inventory']);
  }

  canDeactivate(): boolean {
    return !this.inventoryForm.dirty;
  }
}
