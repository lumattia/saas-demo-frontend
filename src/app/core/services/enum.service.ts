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
export class EnumService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/enums`;

 
  getAssignableRoles(): Observable<string[]> {
    return this.http.get<string[]>(`${this.apiUrl}/roles`);
  }
}
