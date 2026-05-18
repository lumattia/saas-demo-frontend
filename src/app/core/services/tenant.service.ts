import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Tenant, TenantFilter, TenantCreateRequest, TenantUpdateRequest } from '../models/tenant.model';
import { environment } from '../../../environments/environment';
import { PageResponse } from '../models/common.models';
import { IdName } from '../models/common.models';

@Injectable({
  providedIn: 'root'
})
export class TenantService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/tenants`;

  getAll(page: number, size: number, sort?: string, order?: string): Observable<PageResponse<Tenant>> {
    let params = new HttpParams()
      .set('pageNumber', page.toString())
      .set('pageSize', size.toString());
  
    if (sort) params = params.set('sort', sort);

    return this.http.get<PageResponse<Tenant>>(`${this.apiUrl}/page`, { params });
  }

  list(): Observable<IdName[]> {
    return this.http.get<IdName[]>(`${this.apiUrl}/list`);
  }

  getById(id: string): Observable<Tenant> {
    return this.http.get<Tenant>(`${this.apiUrl}/${id}`);
  }

  create(tenant: TenantCreateRequest): Observable<Tenant> {
    return this.http.post<Tenant>(`${this.apiUrl}/create`, tenant);
  }

  update(id: string, tenant: TenantUpdateRequest): Observable<Tenant> {
    return this.http.put<Tenant>(`${this.apiUrl}/update/${id}`, tenant);
  }

  delete(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/delete/${id}`);
  }
}
