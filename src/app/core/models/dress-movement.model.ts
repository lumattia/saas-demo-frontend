import { Dress } from "./dress.model";

export interface DressMovement {
  id: number;
  dressId: number;
  dress: Dress;
  quantity: number;
  instant: string;
}

export interface DressMovementFilter {
  dressTitle?: string;
  sku?: string;
  color?: string;
  size?: string;
  minQuantity?: number;
  maxQuantity?: number;
}
