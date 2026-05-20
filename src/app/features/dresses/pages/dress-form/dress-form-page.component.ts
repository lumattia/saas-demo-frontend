import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
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
    FormsModule,
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
  dress: Partial<Dress> = { title: '', sku: '', size: '', color: '#000000', price: 0 };

  ngOnInit() {
    const idParam = this.route.snapshot.paramMap.get('id');
    if (idParam && idParam !== 'new') {
      this.id = +idParam;
      this.dressService.getById(this.id).subscribe(data => {
        this.dress = data;
      });
    }
  }

  save(): void {
    if (this.id) {
      this.dressService.update(this.id, this.dress).subscribe(() => {
        this.router.navigate(['/dresses']);
      });
    } else {
      this.dressService.create(this.dress).subscribe(() => {
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
}
