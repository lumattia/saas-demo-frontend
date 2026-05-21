import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormGroup, FormControl } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { DressMovementService } from '../../../../core/services/dress-movement.service';
import { DressService } from '../../../../core/services/dress.service';
import { DressMovement } from '../../../../core/models/dress-movement.model';
import { IdName } from '../../../../core/models/common.models';
import { SelectInputComponent } from '../../../../shared/components/inputs/select-input/select-input.component';
import { NumberInputComponent } from '../../../../shared/components/inputs/number-input/number-input.component';

@Component({
  selector: 'app-dress-movement-form-page',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, TranslateModule, SelectInputComponent, NumberInputComponent],
  templateUrl: './dress-movement-form-page.component.html',
  styleUrls: ['./dress-movement-form-page.component.css'],
})
export class DressMovementFormPageComponent implements OnInit {
  private dressMovementService = inject(DressMovementService);
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
      this.dressMovementService.getById(this.id).subscribe((data: DressMovement) => {
        this.inventoryForm.patchValue({
          dressId: data.dress.id.toString(),
          quantity: data.quantity.toString()
        });
      });
    }
  }

  save(): void {
    const formValue = this.inventoryForm.value;
    const item: Partial<DressMovement> = {
      dressId: formValue.dressId ? Number(formValue.dressId) : 0,
      quantity: formValue.quantity ? Number(formValue.quantity) : 0
    };
    if (this.id) {
      this.dressMovementService.update(this.id, item).subscribe(() => {
        this.router.navigate(['/dress-movements']);
      });
    } else {
      this.dressMovementService.create(item).subscribe(() => {
        this.router.navigate(['/dress-movements']);
      });
    }
  }

  delete(): void {
    if (this.id && confirm('Are you sure you want to delete this record?')) {
      this.dressMovementService.delete(this.id).subscribe(() => {
        this.router.navigate(['/dress-movements']);
      });
    }
  }

  exit(): void {
    this.router.navigate(['/dress-movements']);
  }

  canDeactivate(): boolean {
    return !this.inventoryForm.dirty;
  }
}
