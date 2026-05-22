export interface User {
  id: number;
  username: string;
  role: 'USER' | 'ADMIN' | 'RESELLER' | 'SUPERADMIN';
  tenant?: Tenant;
  allowedTenants?: IdName[];
}

export interface Tenant {
  id: string;
  name: string;
  createdAt: string;
  expiresAt: string;
  modules?: string[];
}

export interface IdName {
  id: string;
  name: string;
}

export interface UserFilter {
  username?: string;
  role?: 'USER' | 'ADMIN' | 'RESELLER' | 'SUPERADMIN';
}

export interface UserCreateRequest {
  username: string;
  role: 'USER' | 'ADMIN' | 'RESELLER' | 'SUPERADMIN';
  allowedTenantIds?: string[];
}

export interface UserUpdateRequest {
  id: number;
  username: string;
  role: 'USER' | 'ADMIN' | 'RESELLER' | 'SUPERADMIN';
  allowedTenantIds?: string[];
}
