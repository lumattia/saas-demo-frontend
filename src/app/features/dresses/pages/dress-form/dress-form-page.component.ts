import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { ReactiveFormsModule, FormGroup, FormControl } from '@angular/forms';
import { ActivatedRoute, Router, ParamMap } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { DressService } from '../../../../core/services/dress.service';
import { Dress } from '../../../../core/models/dress.model';
import { TextInputComponent } from '../../../../shared/components/inputs/text-input/text-input.component';
import { ColorInputComponent } from '../../../../shared/components/inputs/color-input/color-input.component';
import { NumberInputComponent } from '../../../../shared/components/inputs/number-input/number-input.component';
import { ButtonComponent } from '../../../../shared/components/button/button.component';
import { CanDeactivateComponent } from '../../../../core/guards/unsaved-changes.guard';
import { ModalService } from '../../../../shared/services/modal.service';
import { UnsavedChangesModalComponent } from '../../../../shared/components/modals/unsaved-changes-modal/unsaved-changes-modal.component';

@Component({
  selector: 'app-dress-form-page',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    TranslateModule,
    TextInputComponent,
    ColorInputComponent,
    NumberInputComponent,
    ButtonComponent,
  ],
  templateUrl: './dress-form-page.component.html',
  styleUrls: ['./dress-form-page.component.css'],
})
export class DressFormPageComponent implements OnInit, CanDeactivateComponent {
  private dressService = inject(DressService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private modalService = inject(ModalService);

  id: number | null = null;
  dressForm = new FormGroup({
    title: new FormControl(''),
    sku: new FormControl(''),
    size: new FormControl(''),
    color: new FormControl('#000000'),
    price: new FormControl(0)
  });
  isEditMode = false;
  initialData: any = null;

  get titleControl(): FormControl {
    return this.dressForm.controls['title'] as FormControl;
  }

  get skuControl(): FormControl {
    return this.dressForm.controls['sku'] as FormControl;
  }

  get sizeControl(): FormControl {
    return this.dressForm.controls['size'] as FormControl;
  }

  get colorControl(): FormControl {
    return this.dressForm.controls['color'] as FormControl;
  }

  get priceControl(): FormControl {
    return this.dressForm.controls['price'] as FormControl;
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

      this.dressService.getById(this.id).subscribe(data => {
        this.initialData = {
          title: data.title,
          sku: data.sku,
          size: data.size,
          color: data.color,
          price: data.price
        };
        this.dressForm.patchValue({
          title: data.title,
          sku: data.sku,
          size: data.size,
          color: data.color,
          price: data.price
        });
      });
    } else {
      this.isEditMode = true;
    }
  }

  save(): void {
    const formValue = this.dressForm.value;
    const dress: Partial<Dress> = {
      title: formValue.title || '',
      sku: formValue.sku || '',
      size: formValue.size || '',
      color: formValue.color || '#000000',
      price: formValue.price || 0
    };
    if (this.id) {
      this.dressService.update(this.id, dress).subscribe(() => {
        this.router.navigate(['/dresses']);
      });
    } else {
      this.dressService.create(dress).subscribe(() => {
        this.router.navigate(['/dresses']);
      });
    }
  }

  exit(): void {
    this.router.navigate(['/dresses']);
  }

  enableEditMode(): void {
    this.isEditMode = true;
  }

  cancelEdit(): void {
    if (!this.id) {
      this.router.navigate(['/dresses']);
      return;
    }
    this.isEditMode = false;
    if (this.initialData) {
      this.dressForm.patchValue({
        title: this.initialData.title,
        sku: this.initialData.sku,
        size: this.initialData.size,
        color: this.initialData.color,
        price: this.initialData.price
      });
    }
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: { edit: null },
      queryParamsHandling: 'merge'
    });
  }

  canDeactivate(): boolean | Promise<boolean> {
    if (!this.dressForm.dirty || !this.isEditMode) {
      return true;
    }
    
    const modalRef = this.modalService.open(UnsavedChangesModalComponent, {
      open: true
    });
    
    return modalRef.result;
  }
}
