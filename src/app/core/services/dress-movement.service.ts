import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { DressMovement, DressMovementFilter } from '../models/dress-movement.model';
import { environment } from '../../../environments/environment';
import { PageResponse } from '../models/common.models';

@Injectable({
  providedIn: 'root'
})
export class DressMovementService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/dress-movements`;

  getAll(filter?: DressMovementFilter, pageNumber?: number, pageSize?: number, sort?: string, order?: string): Observable<PageResponse<DressMovement>> {
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
    if (sort) params = params.set('sort', `${sort},${order}`);

    return this.http.get<PageResponse<DressMovement>>(this.apiUrl+'/page', { params });
  }

  getById(id: number): Observable<DressMovement> {
    return this.http.get<DressMovement>(`${this.apiUrl}/${id}`);
  }

  create(dressMovement: Partial<DressMovement>): Observable<DressMovement> {
    return this.http.post<DressMovement>(this.apiUrl+'/create', dressMovement);
  }

  update(id: number, dressMovement: Partial<DressMovement>): Observable<DressMovement> {
    return this.http.put<DressMovement>(this.apiUrl+'/update/'+id, dressMovement);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(this.apiUrl+'/delete/'+id);
  }
}
