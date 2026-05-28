export enum ModuleType {
  DRESS = 'DRESS',
  DRESS_MOVEMENT = 'DRESS_MOVEMENT'
}

export interface Tenant {
  id: string;
  name: string;
  createdAt: string;
  expiresAt: string;
  modules: ModuleType[];
  hasCustomFields: boolean;
}

export interface TenantFilter {
  name?: string;
  module?: ModuleType;
}

export interface TenantCreateRequest {
  name: string;
  modules: ModuleType[];
}

export interface TenantUpdateRequest {
  id: string;
  name: string;
  modules: ModuleType[];
}
