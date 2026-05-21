import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { ReactiveFormsModule, FormGroup, FormControl } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { DressService } from '../../../../core/services/dress.service';
import { Dress } from '../../../../core/models/dress.model';
import { TextInputComponent } from '../../../../shared/components/inputs/text-input/text-input.component';
import { ColorInputComponent } from '../../../../shared/components/inputs/color-input/color-input.component';
import { NumberInputComponent } from '../../../../shared/components/inputs/number-input/number-input.component';

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
  ],
  templateUrl: './dress-form-page.component.html',
  styleUrls: ['./dress-form-page.component.css'],
})
export class DressFormPageComponent implements OnInit {
  private dressService = inject(DressService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);

  id: number | null = null;
  dressForm = new FormGroup({
    title: new FormControl(''),
    sku: new FormControl(''),
    size: new FormControl(''),
    color: new FormControl('#000000'),
    price: new FormControl(0)
  });

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
      this.dressService.getById(this.id).subscribe(data => {
        this.dressForm.patchValue({
          title: data.title,
          sku: data.sku,
          size: data.size,
          color: data.color,
          price: data.price
        });
      });
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

  delete(): void {
    if (this.id && confirm('Are you sure you want to delete this dress?')) {
      this.dressService.delete(this.id).subscribe(() => {
        this.router.navigate(['/dresses']);
      });
    }
  }

  exit(): void {
    this.router.navigate(['/dresses']);
  }

  canDeactivate(): boolean {
    return !this.dressForm.dirty;
  }
}
