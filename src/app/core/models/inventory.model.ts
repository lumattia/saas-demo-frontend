export interface Inventory {
  id: number;
  dressId: number;
  dressTitle?: string;
  quantity: number;
}

export interface InventoryFilter {
  dressTitle?: string;
}
