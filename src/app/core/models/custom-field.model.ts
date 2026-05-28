import { ModuleType } from "./tenant.model";

export enum CustomFieldType {
  TEXT = 'TEXT',
  NUMBER = 'NUMBER',
  DATE = 'DATE',
  SELECT = 'SELECT',
  CHECKBOX = 'CHECKBOX'
}

export interface FieldValidations {
  required?: boolean;
  min?: number;
  max?: number;
  maxLength?: number;
  options?: string[];
}

export interface CustomFieldDefinition {
  id: number;
  groupId: number;
  label: string;
  type: CustomFieldType;
  fieldOrder: number;
  validations?: FieldValidations;
  value?: string;
}

export interface CustomFieldGroup {
  id: number;
  name: string;
  groupOrder: number;
  module: ModuleType;
  definitions: CustomFieldDefinition[];
}

export interface OrderUpdateDTO {
  id: number;
  order: number;
}

export interface OrderUpdateRequest {
  groupOrders: OrderUpdateDTO[];
  fieldOrders: OrderUpdateDTO[];
}

export interface CustomFieldValueSaveRequest {
  customFields: Record<number, string>;
}

export interface CustomFieldGroupCreateRequest {
  name: string;
  groupOrder?: number;
  module: ModuleType;
}

export interface CustomFieldGroupUpdateRequest {
  id: number;
  name: string;
  groupOrder?: number;
  module: ModuleType;
}

export interface CustomFieldDefinitionCreateRequest {
  groupId: number;
  label: string;
  type: CustomFieldType;
  fieldOrder?: number;
  validations?: FieldValidations;
}

export interface CustomFieldDefinitionUpdateRequest {
  id: number;
  groupId: number;
  label: string;
  type: CustomFieldType;
  fieldOrder?: number;
  validations?: FieldValidations;
}
