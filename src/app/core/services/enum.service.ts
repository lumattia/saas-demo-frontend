import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { ModuleType } from '../models/tenant.model';

@Injectable({
  providedIn: 'root'
})
export class EnumService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/enums`;

 
  getAssignableRoles(): Observable<string[]> {
    return this.http.get<string[]>(`${this.apiUrl}/roles`);
  }
  
  getAssignableModules(): Observable<ModuleType[]> {
    return this.http.get<ModuleType[]>(`${this.apiUrl}/modules`);
  }
}
