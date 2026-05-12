import { Dress } from "./dress.model";

export interface Inventory {
  id: number;
  dressId: number;
  dress: Dress;
  quantity: number;
  instant: string;
}

export interface InventoryFilter {
  dressTitle?: string;
}
