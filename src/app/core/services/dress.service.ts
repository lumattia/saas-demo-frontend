import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Dress, DressFilter } from '../models/dress.model';
import { environment } from '../../../environments/environment';
import { PageResponse } from '../models/common.models';
import { IdName } from '../models/common.models';

@Injectable({
  providedIn: 'root'
})
export class DressService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/dresses`;

 getAll(filter: DressFilter | null, page: number, size: number, sort?: string, order?: string): Observable<PageResponse<Dress>> {
  let params = new HttpParams()
    .set('pageNumber', page.toString())
    .set('pageSize', size.toString());
  
  if (filter) {
    Object.entries(filter).forEach(([key, value]) => {
      if (value != null && value !== '') params = params.set(key, value);
    });
  }
    if (sort) params = params.set('sort', `${sort},${order}`);

  return this.http.get<PageResponse<Dress>>(`${this.apiUrl}/page`, { params });
}
 list(): Observable<IdName[]> {
  
  return this.http.get<IdName[]>(`${this.apiUrl}/list`);
}
  getById(id: number): Observable<Dress> {
    return this.http.get<Dress>(`${this.apiUrl}/${id}`);
  }

  create(dress: Partial<Dress>): Observable<Dress> {
    return this.http.post<Dress>(this.apiUrl+'/create', dress);
  }

  update(id: number, dress: Partial<Dress>): Observable<Dress> {
    return this.http.put<Dress>(this.apiUrl+'/update/'+id, dress);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(this.apiUrl+'/delete/'+id);
  }
}
