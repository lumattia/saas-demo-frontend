import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Inventory, InventoryFilter } from '../models/inventory.model';
import { environment } from '../../../environments/environment';
import { PageResponse } from '../interfaces/pageResponse.interface';

@Injectable({
  providedIn: 'root'
})
export class InventoryService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/inventory`;

  getAll(filter?: InventoryFilter, sort?: string, order?: string): Observable<PageResponse<Inventory>> {
    let params = new HttpParams();
    if (filter) {
      Object.entries(filter).forEach(([key, value]) => {
        if (value) params = params.set(key, value);
      });
    }
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
