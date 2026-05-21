import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Inventory, InventoryFilter } from '../models/inventory.model';
import { environment } from '../../../environments/environment';
import { PageResponse } from '../models/common.models';

@Injectable({
  providedIn: 'root'
})
export class InventoryService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/inventory`;

  getAll(filter?: InventoryFilter, pageNumber?: number, pageSize?: number, sort?: string, order?: string): Observable<PageResponse<Inventory>> {
    let params = new HttpParams();
    if (filter) {
      // Map frontend filter names to backend filter names
      if (filter.dressTitle) params = params.set('title', filter.dressTitle);
      if (filter.sku) params = params.set('sku', filter.sku);
      if (filter.color) params = params.set('color', filter.color);
      if (filter.size) params = params.set('size', filter.size);
      if (filter.minQuantity !== undefined) params = params.set('minQuantity', filter.minQuantity.toString());
      if (filter.maxQuantity !== undefined) params = params.set('maxQuantity', filter.maxQuantity.toString());
    }
    if (pageNumber) params = params.set('pageNumber', pageNumber.toString());
    if (pageSize) params = params.set('pageSize', pageSize.toString());
    if (sort) params = params.set('sort', sort);
    if (order) params = params.set('order', order);

    return this.http.get<PageResponse<Inventory>>(this.apiUrl+'/page', { params });
  }

  getById(id: number): Observable<Inventory> {
    return this.http.get<Inventory>(`${this.apiUrl}/${id}`);
  }

  create(inventory: Partial<Inventory>): Observable<Inventory> {
    return this.http.post<Inventory>(this.apiUrl+'/create', inventory);
  }

  update(id: number, inventory: Partial<Inventory>): Observable<Inventory> {
    return this.http.put<Inventory>(this.apiUrl+'/update/'+id, inventory);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(this.apiUrl+'/delete/'+id);
  }
}
