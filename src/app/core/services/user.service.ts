import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { User, UserFilter, UserCreateRequest, UserUpdateRequest } from '../models/user.model';
import { environment } from '../../../environments/environment';
import { PageResponse } from '../models/common.models';
import { IdName } from '../models/common.models';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/users`;

  getAll(filter: UserFilter | null, page: number, size: number, sort?: string, order?: string): Observable<PageResponse<User>> {
    let params = new HttpParams()
      .set('pageNumber', page.toString())
      .set('pageSize', size.toString());
  
    if (filter) {
      Object.entries(filter).forEach(([key, value]) => {
        if (value != null && value !== '') params = params.set(key, value);
      });
    }
    if (sort) params = params.set('sort', sort);

    return this.http.get<PageResponse<User>>(`${this.apiUrl}/page`, { params });
  }

  list(): Observable<IdName[]> {
    return this.http.get<IdName[]>(`${this.apiUrl}/list`);
  }

  getById(id: number): Observable<User> {
    return this.http.get<User>(`${this.apiUrl}/${id}`);
  }

  create(user: UserCreateRequest): Observable<User> {
    return this.http.post<User>(`${this.apiUrl}/create`, user);
  }

  update(id: number, user: UserUpdateRequest): Observable<User> {
    return this.http.put<User>(`${this.apiUrl}/update/${id}`, user);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/delete/${id}`);
  }

  switchTenant(tenantId: string): Observable<User> {
    return this.http.post<User>(`${this.apiUrl}/switch-tenant`, { tenantId });
  }
}
