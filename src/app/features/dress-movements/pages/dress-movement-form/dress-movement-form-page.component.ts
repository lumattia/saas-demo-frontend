import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormGroup, FormControl, Validators } from '@angular/forms';
import { ActivatedRoute, Router, ParamMap } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { DressMovementService } from '../../../../core/services/dress-movement.service';
import { DressService } from '../../../../core/services/dress.service';
import { DressMovement } from '../../../../core/models/dress-movement.model';
import { IdName } from '../../../../core/models/common.models';
import { SelectInputComponent } from '../../../../shared/components/inputs/select-input/select-input.component';
import { NumberInputComponent } from '../../../../shared/components/inputs/number-input/number-input.component';
import { ButtonComponent } from '../../../../shared/components/button/button.component';
import { CanDeactivateComponent } from '../../../../core/guards/unsaved-changes.guard';

@Component({
  selector: 'app-dress-movement-form-page',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, TranslateModule, SelectInputComponent, NumberInputComponent, ButtonComponent],
  templateUrl: './dress-movement-form-page.component.html',
  styleUrls: ['./dress-movement-form-page.component.css'],
})
export class DressMovementFormPageComponent implements OnInit, CanDeactivateComponent {
  private dressMovementService = inject(DressMovementService);
  private dressService = inject(DressService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);

  id: number | null = null;
  dressMovementForm = new FormGroup({
    dressId: new FormControl('', [Validators.required]),
    quantity: new FormControl('', [Validators.required, Validators.min(1)])
  });
  dresses: IdName[] = [];
  isEditMode = false;
  initialData: any = null;

  getControl(name: string): FormControl {
    return this.dressMovementForm.get(name) as FormControl;
  }

  ngOnInit() {
    const idParam = this.route.snapshot.paramMap.get('id');
    if (idParam && idParam !== 'new') {
      this.id = +idParam;
      this.isEditMode = false;
      
      this.route.queryParamMap.subscribe((params: ParamMap) => {
        const editParam = params.get('edit');
        if (editParam === 'true') {
          this.isEditMode = true;
        }
      });
      this.dressMovementService.getById(this.id).subscribe((data: DressMovement) => {
        this.initialData = {
          dressId: data.dress.id.toString(),
          quantity: data.quantity.toString(),
          dress: data.dress
        };
        this.dressMovementForm.patchValue({
          dressId: data.dress.id.toString(),
          quantity: data.quantity.toString()
        });
      });
    } else {
      this.isEditMode = true;
    }
    this.dressService.list().subscribe(data => this.dresses = data);
  }

  save(): void {
    const formValue = this.dressMovementForm.value;
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

  exit(): void {
    this.router.navigate(['/dress-movements']);
  }

  enableEditMode(): void {
    this.isEditMode = true;
  }

  cancelEdit(): void {
    if (!this.id) {
      this.router.navigate(['/dress-movements']);
      return;
    }
    this.isEditMode = false;
    if (this.initialData) {
      this.dressMovementForm.patchValue({
        dressId: this.initialData.dressId,
        quantity: this.initialData.quantity
      });
    }
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: { edit: null },
      queryParamsHandling: 'merge'
    });
  }

  canDeactivate(): boolean | Promise<boolean> {
    return this.dressMovementForm.dirty || this.customFieldsForm.dirty;
  }
}
