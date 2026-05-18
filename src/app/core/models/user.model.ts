export interface User {
  id: number;
  username: string;
  role: 'USER' | 'ADMIN';
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
  role?: 'USER' | 'ADMIN';
}

export interface UserCreateRequest {
  username: string;
  role: 'USER' | 'ADMIN';
  allowedTenantIds?: string[];
}

export interface UserUpdateRequest {
  id: number;
  username: string;
  role: 'USER' | 'ADMIN';
  allowedTenantIds?: string[];
}
