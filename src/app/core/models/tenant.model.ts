export enum ModuleType {
  DRESS = 'DRESS',
  INVENTORY = 'INVENTORY'
}

export enum UserRole {
  SUPERADMIN = 'SUPERADMIN',
  ADMIN = 'ADMIN',
  USER = 'USER'
}

export interface Tenant {
  id: number;
  name: string;
  modules: ModuleType[];
}

export interface User {
  id: number;
  username: string;
  role: UserRole;
  tenant: Tenant;
  allowedTenants?: Tenant[];
}
