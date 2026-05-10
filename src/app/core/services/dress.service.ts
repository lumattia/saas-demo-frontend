import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Dress, DressFilter } from '../models/dress.model';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class DressService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/dresses`;

  getAll(filter?: DressFilter, sort?: string, order?: string): Observable<Dress[]> {
    let params = new HttpParams();
    if (filter) {
      Object.entries(filter).forEach(([key, value]) => {
        if (value) params = params.set(key, value);
      });
    }
    if (sort) params = params.set('sort', sort);
    if (order) params = params.set('order', order);

    return this.http.get<Dress[]>(this.apiUrl, { params });
  }

  getById(id: number): Observable<Dress> {
    return this.http.get<Dress>(`${this.apiUrl}/${id}`);
  }

  create(dress: Partial<Dress>): Observable<Dress> {
    return this.http.post<Dress>(this.apiUrl, dress);
  }

  update(id: number, dress: Partial<Dress>): Observable<Dress> {
    return this.http.put<Dress>(`${this.apiUrl}/${id}`, dress);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
