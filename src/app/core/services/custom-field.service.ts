import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import {
  CustomFieldGroup,
  CustomFieldDefinition,
  OrderUpdateRequest,
  CustomFieldValueSaveRequest,
  CustomFieldGroupCreateRequest,
  CustomFieldGroupUpdateRequest,
  CustomFieldDefinitionCreateRequest,
  CustomFieldDefinitionUpdateRequest
} from '../models/custom-field.model';
import { ModuleType } from '../models/tenant.model';

@Injectable({
  providedIn: 'root'
})
export class CustomFieldService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/custom-fields`;

  getFormStructure(module: ModuleType, targetId: number): Observable<CustomFieldGroup[]> {
    return this.http.get<CustomFieldGroup[]>(`${this.apiUrl}/form-structure/${module}/${targetId}`);
  }

  saveValues(module: ModuleType, targetId: number, request: CustomFieldValueSaveRequest): Observable<void> {
    return this.http.post<void>(`${this.apiUrl}/values/${module}/${targetId}`, request);
  }

  updateOrders(module: ModuleType, request: OrderUpdateRequest): Observable<void> {
    return this.http.put<void>(`${this.apiUrl}/orders/${module}`, request);
  }

  getGroupsByModule(module: ModuleType): Observable<CustomFieldGroup[]> {
    return this.http.get<CustomFieldGroup[]>(`${this.apiUrl}/groups/${module}`);
  }

  createGroup(request: CustomFieldGroupCreateRequest): Observable<CustomFieldGroup> {
    return this.http.post<CustomFieldGroup>(`${this.apiUrl}/groups`, request);
  }

  updateGroup(request: CustomFieldGroupUpdateRequest): Observable<CustomFieldGroup> {
    return this.http.put<CustomFieldGroup>(`${this.apiUrl}/groups`, request);
  }

  deleteGroup(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/groups/${id}`);
  }

  createDefinition(request: CustomFieldDefinitionCreateRequest): Observable<CustomFieldDefinition> {
    return this.http.post<CustomFieldDefinition>(`${this.apiUrl}/definitions`, request);
  }

  updateDefinition(request: CustomFieldDefinitionUpdateRequest): Observable<CustomFieldDefinition> {
    return this.http.put<CustomFieldDefinition>(`${this.apiUrl}/definitions`, request);
  }

  deleteDefinition(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/definitions/${id}`);
  }
}
